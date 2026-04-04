// routes/conversations.js
// Express router for multi-conversation chat system.
// All endpoints require email for user scoping (no JWT auth yet — assumption A1).

const express = require("express");
const router = express.Router();
const chatService = require("../services/chatService");

// ---------------------------------------------------------------------------
// Middleware: extract and validate email from query or body
// ---------------------------------------------------------------------------
function requireEmail(req, res, next) {
  const email = req.body?.email || req.query?.email;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid email is required" });
  }
  req.userEmail = email.toLowerCase().trim();
  next();
}

// ---------------------------------------------------------------------------
// GET /api/conversations?email=...&status=active&page=1
// List conversations for a user.
// ---------------------------------------------------------------------------
router.get("/", requireEmail, async (req, res) => {
  try {
    const { status, page } = req.query;
    const result = await chatService.listConversations(req.userEmail, {
      status: status || "active",
      page: parseInt(page, 10) || 1,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("[GET /conversations]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/conversations
// Create a new conversation with intake.
// Body: { email, mode, title?, pregnancyWeek?, trimester?, toddlerAgeMonths? }
// ---------------------------------------------------------------------------
router.post("/", requireEmail, async (req, res) => {
  try {
    const { mode, title, pregnancyWeek, trimester, toddlerAgeMonths } = req.body;
    const conversation = await chatService.createConversation(req.userEmail, {
      mode,
      title,
      pregnancyWeek: pregnancyWeek ? Number(pregnancyWeek) : undefined,
      trimester: trimester ? Number(trimester) : undefined,
      toddlerAgeMonths: toddlerAgeMonths ? Number(toddlerAgeMonths) : undefined,
    });
    res.status(201).json({ success: true, conversation });
  } catch (err) {
    console.error("[POST /conversations]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/conversations/:id?email=...
// Get single conversation details.
// ---------------------------------------------------------------------------
router.get("/:id", requireEmail, async (req, res) => {
  try {
    const conversation = await chatService.getConversation(req.params.id, req.userEmail);
    res.json({ success: true, conversation });
  } catch (err) {
    console.error("[GET /conversations/:id]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/conversations/:id
// Rename conversation.
// Body: { email, title }
// ---------------------------------------------------------------------------
router.patch("/:id", requireEmail, async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await chatService.renameConversation(req.params.id, req.userEmail, title);
    res.json({ success: true, conversation });
  } catch (err) {
    console.error("[PATCH /conversations/:id]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/conversations/:id/archive
// Soft-delete (archive) a conversation.
// Body: { email }
// ---------------------------------------------------------------------------
router.patch("/:id/archive", requireEmail, async (req, res) => {
  try {
    const result = await chatService.archiveConversation(req.params.id, req.userEmail);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("[PATCH /conversations/:id/archive]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/conversations/:id
// Permanently delete a conversation and its messages.
// Body: { email }
// ---------------------------------------------------------------------------
router.delete("/:id", requireEmail, async (req, res) => {
  try {
    const result = await chatService.deleteConversation(req.params.id, req.userEmail);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("[DELETE /conversations/:id]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/conversations/:id/messages?email=...&page=1
// Get messages for a conversation with pagination.
// ---------------------------------------------------------------------------
router.get("/:id/messages", requireEmail, async (req, res) => {
  try {
    const { page } = req.query;
    const result = await chatService.getMessages(req.params.id, req.userEmail, {
      page: parseInt(page, 10) || 1,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("[GET /conversations/:id/messages]", err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/conversations/:id/messages
// Send a message in a conversation and get AI response.
// Body: { email, message, idempotencyKey? }
// ---------------------------------------------------------------------------
router.post("/:id/messages", requireEmail, async (req, res) => {
  try {
    const { message, idempotencyKey } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (message.length > 10000) {
      return res.status(400).json({ success: false, message: "Message exceeds 10000 character limit" });
    }

    // groq instance is attached to app in server.js
    const groq = req.app.get("groq");
    if (!groq) {
      return res.status(503).json({ success: false, message: "AI service not configured" });
    }

    const result = await chatService.sendMessage(
      groq,
      req.params.id,
      req.userEmail,
      message,
      idempotencyKey || null
    );

    res.json({
      success: true,
      reply: result.assistantMsg.content,
      userMessage: result.userMsg,
      assistantMessage: result.assistantMsg,
      deduplicated: result.deduplicated || false,
    });
  } catch (err) {
    console.error("[POST /conversations/:id/messages]", err.message);
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message,
      retryable: err.retryable || false,
    });
  }
});

module.exports = router;
