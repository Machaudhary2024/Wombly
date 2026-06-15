// services/chatService.js
// Orchestrates conversation lifecycle: creation, intake, message send/receive, history.
// Keeps Express routes thin - all business logic lives here.

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const { buildSystemPrompt } = require("./promptRouter");
const detectionService = require("./safety/detectionService");
const { searchKnowledgeBase, formatContext } = require("./ragService");

// Max messages to send to AI for context (prevents oversized payloads)
const MAX_CONTEXT_MESSAGES = 40;
// Max messages per page for pagination
const PAGE_SIZE = 50;

/**
 * Helper: calculate current pregnancy week from user profile.
 * Duplicated from server.js to keep service self-contained.
 */
function calculateCurrentWeek(user) {
  if (!user.pregnancyWeek || !user.pregnancyWeekEnteredDate) return null;
  const enteredDate = new Date(user.pregnancyWeekEnteredDate);
  const now = new Date();
  const diffWeeks = Math.floor((now - enteredDate) / (1000 * 60 * 60 * 24 * 7));
  const currentWeek = user.pregnancyWeek + diffWeeks;
  return currentWeek > 0 && currentWeek <= 42 ? currentWeek : null;
}

/**
 * List conversations for a user, sorted by lastMessageAt descending.
 */
async function listConversations(email, { status = "active", page = 1 } = {}) {
  const skip = (Math.max(1, page) - 1) * PAGE_SIZE;
  const filter = { userEmail: email.toLowerCase() };
  if (status) filter.status = status;

  const [conversations, total] = await Promise.all([
    Conversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
    Conversation.countDocuments(filter),
  ]);

  return {
    conversations,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  };
}

/**
 * Create a new conversation with intake metadata.
 * Intake is mandatory - mode must be provided.
 */
async function createConversation(email, { mode, title, pregnancyWeek, trimester, toddlerAgeMonths } = {}) {
  if (!Conversation.VALID_MODES.includes(mode)) {
    throw Object.assign(new Error(`Invalid mode: "${mode}". Must be one of: ${Conversation.VALID_MODES.join(", ")}`), { statusCode: 400 });
  }

  const userEmail = email.toLowerCase();

  // Validate user exists
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  // Build intake metadata
  const intake = { completedAt: new Date() };
  if (mode === "pregnancy" || mode === "both") {
    intake.pregnancyWeek = pregnancyWeek || calculateCurrentWeek(user) || null;
    if (intake.pregnancyWeek) {
      intake.trimester = intake.pregnancyWeek <= 12 ? 1 : intake.pregnancyWeek <= 27 ? 2 : 3;
    } else if (trimester) {
      intake.trimester = trimester;
    }
  }
  if (mode === "toddler" || mode === "both") {
    intake.toddlerAgeMonths = toddlerAgeMonths || null;
  }

  const conversation = await Conversation.create({
    userEmail,
    title: sanitizeTitle(title) || "New Conversation",
    mode,
    intake,
  });

  return conversation.toObject();
}

/**
 * Get a single conversation, enforcing user ownership.
 */
async function getConversation(conversationId, email) {
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) {
    throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
  }
  if (conversation.userEmail !== email.toLowerCase()) {
    throw Object.assign(new Error("Access denied"), { statusCode: 403 });
  }
  return conversation;
}

/**
 * Rename a conversation title.
 */
async function renameConversation(conversationId, email, newTitle) {
  const conversation = await getConversation(conversationId, email);
  const sanitized = sanitizeTitle(newTitle);
  if (!sanitized) {
    throw Object.assign(new Error("Title cannot be empty"), { statusCode: 400 });
  }
  await Conversation.updateOne({ _id: conversation._id }, { title: sanitized });
  return { ...conversation, title: sanitized };
}

/**
 * Archive (soft-delete) a conversation.
 */
async function archiveConversation(conversationId, email) {
  const conversation = await getConversation(conversationId, email);
  await Conversation.updateOne({ _id: conversation._id }, { status: "archived" });
  return { success: true };
}

/**
 * Delete a conversation and its messages permanently.
 */
async function deleteConversation(conversationId, email) {
  const conversation = await getConversation(conversationId, email);
  await Promise.all([
    Message.deleteMany({ conversationId: conversation._id }),
    Conversation.deleteOne({ _id: conversation._id }),
  ]);
  return { success: true };
}

/**
 * Get messages for a conversation with pagination.
 */
async function getMessages(conversationId, email, { page = 1 } = {}) {
  // Ownership check
  await getConversation(conversationId, email);

  const skip = (Math.max(1, page) - 1) * PAGE_SIZE;
  const filter = { conversationId, userEmail: email.toLowerCase() };

  const [messages, total] = await Promise.all([
    Message.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
    Message.countDocuments(filter),
  ]);

  return {
    messages,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  };
}

/**
 * Send a message in a conversation and get AI response.
 * Enforces intake completion, builds mode-aware prompt, deduplicates on idempotencyKey.
 *
 * @param {Object} groq - Initialized GROQ SDK instance (injected from server)
 * @param {string} conversationId
 * @param {string} email
 * @param {string} userMessage
 * @param {string|null} idempotencyKey
 * @returns {Object} { userMsg, assistantMsg, conversation }
 */
async function sendMessage(groq, conversationId, email, userMessage, idempotencyKey = null, clientContext = {}) {
  const emailLower = email.toLowerCase();

  // 1. Validate conversation ownership and intake
  const conversation = await getConversation(conversationId, emailLower);
  if (!conversation.intake || !conversation.intake.completedAt) {
    throw Object.assign(new Error("Intake not completed for this conversation"), { statusCode: 400 });
  }

  // 2. Validate user exists and fetch profile
  const user = await User.findOne({ email: emailLower });
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  // 3. Idempotency check - if this message was already saved, return existing
  if (idempotencyKey) {
    const existing = await Message.findOne({ conversationId, idempotencyKey }).lean();
    if (existing) {
      // Find the assistant reply that follows it
      const assistantReply = await Message.findOne({
        conversationId,
        role: "assistant",
        createdAt: { $gt: existing.createdAt },
      }).sort({ createdAt: 1 }).lean();
      return { userMsg: existing, assistantMsg: assistantReply, conversation, deduplicated: true };
    }
  }

  // 4. Validate message content
  const trimmedMessage = userMessage.trim();
  if (!trimmedMessage || trimmedMessage.length > 10000) {
    throw Object.assign(new Error("Message must be 1-10000 characters"), { statusCode: 400 });
  }

  // 5. Build prompt context (with optional location awareness from the client)
  const currentWeek = calculateCurrentWeek(user);

  // RAG: search knowledge base in parallel with fetching message history
  const [ragResults, recentMessages] = await Promise.all([
    searchKnowledgeBase(trimmedMessage, { mode: conversation.mode, topK: 4 }),
    Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(MAX_CONTEXT_MESSAGES)
      .lean(),
  ]);
  recentMessages.reverse(); // chronological order

  const ragContext = formatContext(ragResults);

  const systemPrompt = buildSystemPrompt({
    user,
    mode: conversation.mode,
    intake: conversation.intake,
    currentWeek,
    client_country: clientContext.client_country,
    client_city: clientContext.client_city,
    ragContext,
  });

  // 6. Compose messages for AI
  const aiMessages = [
    { role: "system", content: systemPrompt },
    ...recentMessages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: trimmedMessage },
  ];

  // 7. Save user message
  const userMsg = await Message.create({
    conversationId,
    userEmail: emailLower,
    role: "user",
    content: trimmedMessage,
    pregnancyWeekAtTime: currentWeek,
    idempotencyKey: idempotencyKey || undefined,
  });

  // 8. Call AI
  let reply;
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: aiMessages,
    });
    reply = response.choices[0].message.content;
  } catch (aiError) {
    console.error("[ChatService] AI provider error:", aiError.message);
    // Don't delete the user message - it's saved. Mark the error.
    throw Object.assign(new Error("AI service temporarily unavailable. Your message was saved - please retry."), {
      statusCode: 503,
      retryable: true,
    });
  }

  // 9. Save assistant message
  const assistantMsg = await Message.create({
    conversationId,
    userEmail: emailLower,
    role: "assistant",
    content: reply,
    pregnancyWeekAtTime: currentWeek,
  });

  // 10. Update conversation metadata
  const isFirstMessage = conversation.messageCount === 0;
  const updateFields = {
    lastMessageAt: new Date(),
    $inc: { messageCount: 2 },
  };

  // Auto-title from first user message (truncated)
  if (isFirstMessage) {
    updateFields.title = trimmedMessage.substring(0, 80) + (trimmedMessage.length > 80 ? "..." : "");
  }

  await Conversation.updateOne({ _id: conversationId }, updateFields);

  // 11. Safety check on the recent user-window - never blocks the reply, only annotates.
  //     Frontend uses `safety.action_recommended` to decide whether to show the Crisis Sheet.
  let safety = null;
  try {
    const userTurns = recentMessages
      .filter((m) => m.role === "user")
      .slice(-4)
      .map((m) => ({ role: "user", text: m.content, ts: new Date(m.createdAt).toISOString() }));
    userTurns.push({ role: "user", text: trimmedMessage, ts: new Date().toISOString() });

    safety = detectionService.detect({
      session_id: conversationId.toString(),
      turns: userTurns,
    });
  } catch (safetyErr) {
    // Detection must never break chat - log and continue.
    console.error("[ChatService] safety detection error:", safetyErr.message);
    safety = null;
  }

  return { userMsg: userMsg.toObject(), assistantMsg: assistantMsg.toObject(), conversation, safety };
}

/**
 * Sanitize user-provided title.
 */
function sanitizeTitle(title) {
  if (!title || typeof title !== "string") return null;
  // Strip control chars and excessive whitespace
  return title.replace(/[\x00-\x1F\x7F]/g, "").trim().substring(0, 200) || null;
}

module.exports = {
  listConversations,
  createConversation,
  getConversation,
  renameConversation,
  archiveConversation,
  deleteConversation,
  getMessages,
  sendMessage,
  calculateCurrentWeek,
  PAGE_SIZE,
};
