# Merger Changes: `ninjakashaf/Wombly-main` → `Chatbot-and-Minor-Changes`

**Merge commit:** `a77de28`  
**Date:** March 29, 2026  
**Editor:** Kashaf Nadeem (`https://github.com/ninjakashaf/`)  
**Summary:** Merged Kashaf's (`ninjakashaf`) main repo (`ninjakashaf/Wombly-main`) into Mehar's repo branch (`Machaudhary2024/Wombly/tree/Chatbot-and-Minor-Changes`) created by Kashaf i.e ME. The merge brought in a fully fleshed-out authentication flow, a real AI chatbot backend, and a system-wide replacement of native `Alert` dialogs with custom in-app modals.

---

## 1. New Screens Added

| Screen | File | Description |
|---|---|---|
| Forgot Password | `ForgotPasswordScreen.js` | Lets users request a password reset OTP via email |
| Reset Password | `ResetPasswordScreen.js` | OTP verification + new password entry (647 lines) |
| Change Password | `ChangePasswordScreen.js` | In-app password change for logged-in users (475 lines) |
---

## 2. AI Chatbot | Full Backend Integration

**File:** `AIChatScreen.js`

The chatbot was completely reworked. The old implementation used hardcoded keyword matching to return static string responses. It has been replaced with a live backend API call.

**Before:**
```js
// Keyword-based static responses
if (lowerMessage.includes('pregnancy')) {
  return "Pregnancy is an exciting journey! ..."
}
```

**After:**
```js
// Real API call with full conversation history for memory/context
const response = await fetch(`${BACKEND_URL}/api/chat`, {
  method: "POST",
  body: JSON.stringify({
    email: userEmail,
    message: userMessage,
    conversationHistory: updatedMessages, // AI retains context across the session
  }),
});
```

**Other chatbot changes:**
- `API_BASE_URL` imported from `apiConfig.js` (centralised config) instead of being hardcoded
- Chat history can now be cleared; added a custom confirmation modal before deletion
- `backend/models/ChatLog.js` added to persist chat logs in MongoDB
- `backend/CHATBOT_API_INTEGRATION.md` added with full integration documentation

---

## 3. Password Reset Flow | New Backend Endpoints

**File:** `backend/server.js`

Two new API endpoints were added:

### `POST /api/forgot-password`
- Looks up the user by email
- Verifies the account is confirmed (`isVerified`)
- Generates a time-limited OTP and sends it via Nodemailer
- Reuses the existing `otpService` infrastructure

### `POST /api/reset-password`
- Verifies the OTP submitted by the user
- Updates the user's hashed password in MongoDB

**Additional file:** `backend/CHANGE_PASSWORD_ENDPOINT.md` | documents the in-app change password endpoint.

---

## 5. Navigation Updates (`App.js`)

Three new authenticated routes were registered:

```js
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
<Stack.Screen name="ResetPassword"  component={ResetPasswordScreen} />
<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
```

---

## 6. Custom Modal System (Replaces `Alert.alert`)

A consistent pattern was adopted across multiple screens to replace React Native's `Alert.alert()` with custom in-app `Modal` components. The reason noted in code comments: the native Alert API was unreliable across platforms and was silently disabling buttons in some cases.

Screens updated with custom modals:

| Screen | Modal Purpose |
|---|---|
| `LoginScreen.js` | Error messages, login success, verification prompts |
| `HomeScreen.js` | Logout confirmation |
| `AIChatScreen.js` | Clear chat history confirmation |

All modals follow the same pattern: a semi-transparent overlay, an icon, a title, a message, and Cancel / Confirm buttons.

---

## 8. Dependency Updates

**Files:** `package.json`, `backend/package.json`, `package-lock.json`, `backend/package-lock.json`

- Frontend and backend `package-lock.json` files were regenerated to reflect aligned dependency versions (commit `a0b6065`: *"finalized dependency versions"*)
- Backend gained `ChatLog` model dependency wired into `server.js`

---

## Files Changed at a Glance

| File | Change Type | Lines ±  |
|---|---|---|
| `AIChatScreen.js` | Modified | ~284 |
| `AccountInfoScreen.js` | Modified | ~228 |
| `App.js` | Modified | ~22 |
| `HomeScreen.js` | Modified | ~114 |
| `LoginScreen.js` | Modified | ~201 |
| `apiConfig.js` | Modified | ~11 |
| `backend/server.js` | Modified | ~408 |
| `ChangePasswordScreen.js` | **New** | +475 |
| `ForgotPasswordScreen.js` | **New** | +380 |
| `ResetPasswordScreen.js` | **New** | +647 |
| `backend/models/ChatLog.js` | **New** | +11 |
| `backend/CHATBOT_API_INTEGRATION.md` | **New** | +283 |
| `backend/CHANGE_PASSWORD_ENDPOINT.md` | **New** | +134 |
