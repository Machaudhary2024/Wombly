# 🤖 WOMBLY AI Assistant — Chatbot Integration

A personalized AI-powered maternal health chatbot built into the WOMBLY app. It uses real user data stored in MongoDB to give mothers tailored advice based on their pregnancy week, age, weight, and height.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [File Structure](#file-structure)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Environment Variables](#environment-variables)

---

## Overview

The WOMBLY AI Assistant replaces a hardcoded keyword-based chatbot with a real AI model (Groq — `llama-3.3-70b-versatile`). It fetches the logged-in mother's profile from MongoDB and injects it into the AI's system prompt, making every response personal and context-aware.

Chat history is persisted in MongoDB so conversations are preserved across sessions.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI Provider | [Groq](https://console.groq.com) — free tier |
| AI Model | `llama-3.3-70b-versatile` |

---

## Features

- ✅ **Personalized responses** — AI knows the mother's name, age, weight, height, and current pregnancy week
- ✅ **Real-time chat** — smooth messaging UI with loading indicator
- ✅ **Persistent chat history** — conversations saved to MongoDB and restored on reopen
- ✅ **Multi-turn memory** — full conversation history sent to AI on every message
- ✅ **Clear chat** — confirmation modal before deleting history
- ✅ **Error handling** — graceful fallback messages if connection fails
- ✅ **Auto pregnancy week calculation** — calculates current week based on entry date

---

## File Structure

```
backend/
├── models/
│   ├── User.js              # User schema (name, age, weight, height, pregnancyWeek...)
│   └── ChatLog.js           # Chat history schema (userEmail, message, reply, pregnancyWeekAtTime)
├── server.js                # Express server — includes /api/chat, /api/chat-history endpoints
└── .env                     # GROQ_API_KEY stored here

app/
└── screens/
    └── AIChatScreen.js      # React Native chat UI
```

---

## Setup & Installation

### 1. Install dependencies

```bash
cd backend
npm install groq-sdk
```

### 2. Add your Groq API key to `.env`

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```

> Get your free API key at [console.groq.com](https://console.groq.com) — no credit card required.

### 3. Create the ChatLog model

Create `backend/models/ChatLog.js`:

```js
const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  message:   { type: String, required: true },
  reply:     { type: String, required: true },
  pregnancyWeekAtTime: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("ChatLog", chatLogSchema);
```

### 4. Set your backend URL in `AIChatScreen.js`

```js
const BACKEND_URL = "http://YOUR_LOCAL_IP:5000";
```

> Use your machine's local IP (e.g. `192.168.1.5`), not `localhost`, so the phone can reach the server.

### 5. Start the backend

```bash
cd backend
node server.js
```

---

## API Endpoints

### `POST /api/chat`
Sends a message to the AI and returns a personalized response.

**Request body:**
```json
{
  "email": "mother@example.com",
  "message": "How should I sleep at week 24?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "reply": "At week 24, sleeping on your left side is recommended because..."
}
```

---

### `GET /api/chat-history`
Fetches the last 50 messages for a user.

**Query params:** `?email=mother@example.com`

**Response:**
```json
{
  "success": true,
  "messages": [
    { "id": 1, "text": "How do I manage nausea?", "sender": "user" },
    { "id": 2, "text": "At your stage, here are some tips...", "sender": "bot" }
  ]
}
```

---

### `DELETE /api/chat-history`
Deletes all chat history for a user.

**Request body:**
```json
{
  "email": "mother@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat history cleared"
}
```

---

## How It Works

1. Mother opens the chat screen → app fetches her chat history from MongoDB
2. She sends a message → backend fetches her full profile from the `User` collection
3. Her data (name, age, weight, height, current pregnancy week) is injected into the AI system prompt
4. Full conversation history is sent to Groq so the AI remembers context
5. AI response is returned to the app and saved to the `ChatLog` collection
6. On next open, history is restored automatically

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `PORT` | Backend server port (default: `5000`) |

---

## Expanding User Data for the AI (Future Development)

Currently, the chatbot fetches data from the `User` model only. As the app grows and new schemas are added (e.g. symptom logs, appointment records, mood tracking, baby milestones), the AI can be made even more personalized by pulling from those collections too.

### How user data is currently fetched

In `server.js`, inside the `POST /api/chat` route, this is where the user's data is fetched and injected into the AI system prompt:

```js
// 1. Fetch user profile from MongoDB
const user = await User.findOne({ email: email.toLowerCase() });

// 2. Calculate current pregnancy week
const currentWeek = calculateCurrentWeek(user);

// 3. Inject into system prompt
const systemPrompt = `You are WOMBLY...
- Name: ${user.name}
- Age: ${user.age}
- Weight: ${user.weight}
- Pregnancy Week: ${currentWeek}
`;
```

### How to expand it to a new schema

Say you create a new `SymptomLog` model and want the AI to know about recent symptoms the mother logged. Here's the pattern to follow:

**Step 1 — Create your new model** (e.g. `models/SymptomLog.js`):
```js
const symptomLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  symptom:   { type: String, required: true },
  severity:  { type: String },
}, { timestamps: true });
```

**Step 2 — Import it in `server.js`:**
```js
const SymptomLog = require("./models/SymptomLog");
```

**Step 3 — Fetch the data inside `/api/chat`, alongside the existing user fetch:**
```js
const user = await User.findOne({ email: email.toLowerCase() });

// Add this:
const recentSymptoms = await SymptomLog.find({ userEmail: email })
  .sort({ createdAt: -1 })
  .limit(5);
```

**Step 4 — Add it to the system prompt:**
```js
const systemPrompt = `You are WOMBLY...
- Name: ${user.name}
- Pregnancy Week: ${currentWeek}

Recent symptoms she has logged:
${recentSymptoms.length > 0
  ? recentSymptoms.map(s => `• ${s.symptom} (${s.severity})`).join("\n")
  : "No recent symptoms logged."}
`;
```

### The same pattern applies to any new model:
| New Model | What to fetch | What to add to prompt |
|-----------|--------------|----------------------|
| `AppointmentLog` | Upcoming appointments | "Her next appointment is on X" |
| `MoodLog` | Recent mood entries | "Her mood this week has been X" |
| `BabyMilestone` | Baby milestones | "Her baby reached X milestone" |
| `NutritionLog` | Daily meals | "Her recent meals include X" |

The key principle is: **fetch → format → inject into system prompt**. The more relevant data the AI has, the more personalized and useful its responses become.

---

## Notes

- The AI is instructed to always recommend consulting a doctor for medical decisions
- If the mother mentions severe symptoms (bleeding, fever, severe pain), the AI urges her to contact her doctor immediately
- Chat history is limited to the last **50 messages** per user to keep responses fast