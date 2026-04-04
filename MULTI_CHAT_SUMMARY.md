# Multi-Conversation AI Chat System

## Summary

Transformed the single-thread WOMBLY chatbot into a ChatGPT-style multi-conversation system. Users can now create multiple independent chat threads, each with a mandatory intake that selects a mode (Pregnancy, Toddler, or Both). The selected mode steers the AI's behavior for the entire conversation. A slide-out drawer on the chat screen lets users switch between conversations instantly.

## What Changed

### New Files

| File | Purpose |
|------|---------|
| `backend/models/Conversation.js` | Mongoose model for chat threads (id, user, title, mode, intake, status, timestamps) |
| `backend/models/Message.js` | Mongoose model for individual messages within a conversation |
| `backend/services/chatService.js` | Business logic: conversation CRUD, intake enforcement, AI invocation, pagination |
| `backend/services/promptRouter.js` | Mode-aware system prompt templates (pregnancy, toddler, both) with medical safety guardrails |
| `backend/routes/conversations.js` | Express router: 8 endpoints for conversations and messages |
| `backend/scripts/migrateChatLogs.js` | One-time migration script to move old ChatLog data into new Conversation/Message structure |
| `backend/tests/chatService.test.js` | 12 unit tests covering prompt routing, model validation, and helper functions |
| `components/GlobalChatButton.js` | Single global floating chat button rendered once in App.js, visible on all screens after login |
| `context/UserContext.js` | React Context for user info (email, name), set at login, eliminates prop-drilling |

### Modified Files

| File | Change |
|------|--------|
| `AIChatScreen.js` | Full rewrite: side drawer for conversation list, intake modal for new chats, mode-aware headers, multi-conversation message flow |
| `App.js` | Wrapped in UserProvider, added GlobalChatButton at root level, removed ConversationListScreen |
| `LoginScreen.js` | Sets UserContext on successful login |
| `backend/server.js` | Mounted conversation router, removed legacy /api/chat endpoints and ChatLog import, cleaned up dead code |
| 28 screen files | Removed per-screen FloatingChatButton imports and JSX (replaced by global button) |

### Deleted Files

| File | Why |
|------|-----|
| `ConversationListScreen.js` | Functionality merged into AIChatScreen drawer |
| `components/FloatingChatButton.js` | Replaced by GlobalChatButton |
| `CHATBOT_CONNECTION_FIX.md` | Documented old single-chat system |
| `CHATBOT_FIX_SUMMARY.md` | Documented old single-chat system |
| `backend/CHATBOT_API_INTEGRATION.md` | Documented deleted /api/chat endpoints |
| `backend/scripts/dropBrokenIndex.js` | One-time utility, already used |

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/conversations?email=` | List user's conversations |
| POST | `/api/conversations` | Create conversation with intake (mode required) |
| GET | `/api/conversations/:id?email=` | Get single conversation |
| PATCH | `/api/conversations/:id` | Rename conversation |
| PATCH | `/api/conversations/:id/archive` | Soft-delete |
| DELETE | `/api/conversations/:id` | Hard-delete conversation + messages |
| GET | `/api/conversations/:id/messages?email=` | Get paginated messages |
| POST | `/api/conversations/:id/messages` | Send message, get AI response |

## Conversation Modes

- **Pregnancy**: Prenatal care, week-aware guidance, nutrition, warning signs
- **Toddler**: Feeding, sleep, development, hygiene, safety, behavior
- **Both**: Dual-track responses clearly separating pregnancy and toddler advice

## Migration

Run once to preserve existing chat history:

```
cd backend && node scripts/migrateChatLogs.js
```

Creates one "Previous Conversations" thread per user from old ChatLog data. Safe to re-run. Original ChatLog collection is not deleted.

## Stats

- **Net change**: -933 lines (1,631 removed, 698 added)
- **Files affected**: 37
- **Tests**: 12 unit tests, all passing
