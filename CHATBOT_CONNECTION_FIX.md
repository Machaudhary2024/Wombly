# Wombly Chatbot Connection Fix Guide

## Issue Summary
The floating chatbot icon was not connecting to the `/api/chat` endpoint on both web and mobile platforms, showing "Connection Error - Cannot connect to server. Failed to fetch".

## Root Causes Identified
1. **API URL Configuration** - apiConfig.js was using a hardcoded IP (10.11.117.126) that may not match current network setup
2. **Missing Error Handling** - Chat screen lacked detailed error logging for debugging
3. **Incomplete Screen Setup** - HomeScreen didn't have FloatingChatButton component
4. **Missing User Context** - Some screens not passing userEmail/userName to chat functionality

## Fixes Applied

### 1. Enhanced apiConfig.js (Flexible API Configuration)
**File**: [apiConfig.js](apiConfig.js)

**Changes**:
- Added support for `WOMBLY_API_URL` environment variable
- For web development, defaults to `http://localhost:5000`
- For mobile (Android emulator), uses `http://10.0.2.2:5000`
- For mobile (physical device/iOS), uses `http://10.11.117.126:5000`
- Added debug logging to help identify configuration issues

**How to use**:
```bash
# For custom IP, set environment variable before running:
export WOMBLY_API_URL=http://192.168.1.100:5000

# On Windows PowerShell:
$env:WOMBLY_API_URL="http://192.168.1.100:5000"
```

### 2. Improved AIChatScreen.js (Better Error Handling)
**File**: [AIChatScreen.js](AIChatScreen.js)

**Enhancements**:
- Detailed logging of API calls (URL, email, response status)
- Better error messages shown to users
- Email validation before sending messages
- Improved chat history loading with proper error handling
- Better timeout handling for slow connections

**What to look for in browser console**:
```
Sending chat message to: http://localhost:5000/api/chat
User email: user@example.com
Response status: 200
Chat response: {success: true, reply: "..."}
```

### 3. Added FloatingChatButton to HomeScreen
**File**: [HomeScreen.js](HomeScreen.js)

**Changes**:
- Imported FloatingChatButton component
- Added with proper props: `navigation`, `userEmail`, `userName`
- Users can now access chatbot from the main home screen

### 4. Backend API Endpoints
**File**: [backend/server.js](backend/server.js)

**Endpoints**:
- `POST /api/chat` - Send message to chatbot (line 1364)
  - Required: `email`, `message`
  - Optional: `conversationHistory` (for context)
  - Uses GROQ API for AI responses
  
- `GET /api/chat-history` - Retrieve chat history
  - Required: `email` query parameter
  
- `DELETE /api/chat-history` - Clear chat history
  - Required: `email` in body

## Testing the Fix

### For Web Development
1. Ensure backend is running:
   ```bash
   cd backend
   npm start
   ```
   Expected output:
   ```
   Server is running on port 5000
   MongoDB connected successfully to: mongodb://localhost:27017/wombly
   ```

2. Start frontend:
   ```bash
   npx expo start
   # Select 'w' for web, or 'i' for iOS simulator
   ```

3. Test chatbot connection:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Navigate to a screen with FloatingChatButton
   - Click the chatbot icon
   - Check console logs for API call details
   - Send a test message

**Expected console output**:
```
API Configuration - Platform: Web , Emulator: false , API_URL: http://localhost:5000
Sending chat message to: http://localhost:5000/api/chat
User email: test@example.com
Response status: 200
Chat response: {success: true, reply: "Hi! I'm WOMBLY..."}
```

### For Mobile (Android Emulator)
1. Start emulator
2. Backend must be running on your machine
3. The app will automatically use `http://10.0.2.2:5000`
4. Test the floating chatbot similarly

**If connection fails**:
- Check that backend is running: `curl http://localhost:5000/api/login`
- Verify emulator has network: ping from emulator to host

### For Mobile (Physical Device/iOS)
1. Find your machine's IP:
   ```bash
   # Windows PowerShell:
   ipconfig
   # Look for "IPv4 Address" - typically 192.168.x.x or 10.x.x.x
   ```

2. Set environment variable:
   ```bash
   export WOMBLY_API_URL=http://YOUR_MACHINE_IP:5000
   ```

3. Start app and test chatbot

## Troubleshooting

### "Cannot connect to server" Error
1. **Backend not running**
   - Solution: `cd backend && npm start`

2. **Wrong IP address**
   - Solution: Run `ipconfig` (Windows) and update IP in apiConfig.js or set WOMBLY_API_URL

3. **Firewall blocking connection**
   - Solution: Allow port 5000 through firewall
   - Windows: `netsh advfirewall firewall add rule name="Wombly Backend" dir=in action=allow protocol=tcp localport=5000`

4. **MongoDB not running**
   - Check terminal output: Should see "MongoDB connected successfully"
   - If not: Ensure MongoDB service is running

### Chatbot Responds with Error
1. **Check GROQ_API_KEY**
   - Backend should show in .env file
   - If missing: Get one from https://console.groq.com

2. **Database connection issues**
   - Terminal should show: "MongoDB connected successfully to: mongodb://localhost:27017/wombly"
   - If not: Check MongoDB is running

3. **User not found**
   - Ensure you're logged in with correct email
   - The API returns 404 if email doesn't exist in database

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Web/Mobile)                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ FloatingChatButton (Located on most screens)          │    │
│  │ - Navigation handling                                 │    │
│  │ - User context (email, userName)                     │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────▼─────────────────────────────────┐    │
│  │ AIChatScreen.js                                        │    │
│  │ - Message input/display                               │    │
│  │ - API call to /api/chat                              │    │
│  │ - Error handling & logging                            │    │
│  │ - Chat history management                             │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────▼─────────────────────────────────┐    │
│  │ apiConfig.js                                           │    │
│  │ - API_BASE_URL detection (localhost/IP/10.0.2.2)     │    │
│  │ - Environment variable support                         │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │ HTTP POST/GET/DELETE                 │
└─────────────────────────┼─────────────────────────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │  Backend (Node.js + Express)    │
         │  Port: 5000                      │
         │                                  │
         │  ┌────────────────────────────┐ │
         │  │ POST /api/chat              │ │
         │  │ - Email validation          │ │
         │  │ - User context lookup       │ │
         │  │ - GROQ API integration      │ │
         │  │ - Response formatting       │ │
         │  │ - Chat log storage          │ │
         │  └────────────────────────────┘ │
         │                                  │
         │  ┌────────────────────────────┐ │
         │  │ GET /api/chat-history       │ │
         │  │ DELETE /api/chat-history    │ │
         │  └────────────────────────────┘ │
         │                                  │
         └────────────────┬─────────────────┘
                          │
                 ┌────────▼────────┐
                 │   MongoDB       │
                 │ (Chat Logs)     │
                 └─────────────────┘
```

## Key Configuration Files

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wombly
GROQ_API_KEY=gsk_xxxxxx...  # Get from https://console.groq.com
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password_here
```

### Frontend apiConfig.js
- Default for web: `http://localhost:5000`
- Default for Android emulator: `http://10.0.2.2:5000`
- Default for physical device: `http://10.11.117.126:5000` (update IP as needed)

## Next Steps

1. ✅ Verify backend is running
2. ✅ Test `/api/chat` endpoint using browser DevTools
3. ✅ Confirm FloatingChatButton appears on screens
4. ✅ Send test message and check response
5. Consider updating screens that don't pass `userName` prop to FloatingChatButton

## Support

If issues persist:
1. Check browser console for detailed error messages
2. Check backend terminal for API error logs
3. Verify GROQ_API_KEY in .env file
4. Ensure MongoDB is running
5. Check network connectivity between frontend and backend

---

**Last Updated**: April 2, 2026
**Version**: 1.0
