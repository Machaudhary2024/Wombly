# Wombly Pregnancy Care App - Setup & Integration Guide

A comprehensive React Native app for pregnancy care, postpartum recovery, and toddler guidance with OTP-based authentication and YouTube video integration.
git hub: https://github.com/Machaudhary2024/Wombly.git

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Requirements](#system-requirements)
- [Email OTP Setup](#email-otp-setup)
- [YouTube API Integration](#youtube-api-integration)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Troubleshooting](#troubleshooting)

---

## 📱 Project Overview

**Wombly** is a mobile-first health application providing:
- ✅ OTP-based email verification for secure authentication
- ✅ YouTube video integration for health guidance
- ✅ Pregnancy tracking by week (0-38 weeks)
- ✅ Trimester-specific health modules
- ✅ Postpartum recovery tracking
- ✅ Toddler care and nutrition guidance
- ✅ Real-time notifications and reminders

**Tech Stack:**
- Frontend: React Native with Expo
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT + Email OTP
- Video API: YouTube Data API v3

---

## 💻 System Requirements

### Backend Requirements
- **Node.js** v16+ 
- **MongoDB** v4.4+ (local or cloud instance)
- **npm** v8+ or yarn

### Frontend Requirements
- **Expo CLI** installed globally: `npm install -g expo-cli`
- **React Native** compatible device or emulator
- **npm** v8+ or yarn

### Development Environment
- Visual Studio Code (recommended)
- Git for version control
- Postman for API testing (optional)

---

## 📧 Email OTP Setup

### Overview
The OTP (One-Time Password) system provides secure email-based verification for user registration. Users receive a 6-digit code via email that they must enter during signup.

### Prerequisites
- Gmail account (or any email service)
- Gmail App Password (for Gmail accounts)
- Backend `.env` file configured

### Step 1: Gmail Configuration

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

3. **Update Backend `.env`:**
   ```env
   # Email Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-app-password-16-chars
   ```

### Step 2: OTP Service Configuration

**File:** `backend/services/otpService.js`

The OTP service:
- Generates random 6-digit codes
- Sets 5-minute expiration
- Stores in-memory or database
- Sends via configured email service

**Key Functions:**
```javascript
generateOTP()           // Creates random 6-digit code
sendOTP(email)          // Sends OTP to user email
verifyOTP(email, otp)   // Validates OTP
```

### Step 3: Integration Points

#### Signup Flow (`SignUpScreen.js`):
```javascript
POST /api/signup
{
  name: "John Doe",
  email: "user@example.com",
  age: 28,
  phone: "03001234567",
  password: "HashedPassword123"
}
// Response: { otpSent: true, message: "OTP sent to email" }
```

#### Verification (`OTPVerificationScreen.js`):
```javascript
POST /api/verify-otp
{
  email: "user@example.com",
  otp: "123456"
}
// Response: { success: true, token: "jwt-token" }
```

### Step 4: OTP Testing

**Development Mode:**
- OTPs are logged to backend console
- Check terminal output for generated codes
- OTP expires after 5 minutes
- Can resend after 1 minute

**Testing Signup Flow:**
1. Open app → Click "Sign Up"
2. Fill registration form
3. Click "Send OTP"
4. Check backend console for OTP code
5. Enter OTP in verification screen
6. Receive success message with auth token

### OTP Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "OTP not sent" | Email service not configured | Check `.env` file and email credentials |
| "Invalid OTP" | Wrong code or expired | OTP valid for 5 minutes, check console |
| "Email authentication failed" | Gmail app password incorrect | Use 16-char app password, not regular password |
| "Cannot send email" | SMTP blocked by ISP | Switch to SendGrid or AWS SES |

---

## 🎬 YouTube API Integration

### Overview
The YouTube integration fetches relevant health and wellness videos for pregnancy care, postpartum recovery, and toddler guidance. Videos are displayed with thumbnails, titles, and descriptions.

### Prerequisites
- Google Cloud Project
- YouTube Data API v3 enabled
- API Key with proper permissions
- Quota available (100 queries/day free)

### Step 1: Create Google Cloud Project

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create New Project:**
   - Click "Select a Project" → "New Project"
   - Enter project name: `Wombly-YouTube-API`
   - Click "Create"

3. **Enable YouTube Data API v3:**
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

### Backend Architecture

**Video Storage:** All videos are stored in MongoDB collection `videos` with the following types:
- **Cartoons** - 25 videos across 5 channels (tom_jerry, pink_panther, DeanTV, MrBean, Masha_bear)
- **Lullabies** - 25 videos across 5 channels (SuperSimpleSongs, Zeazara_KidsTV, kidzone, BabyTV, Tiny_MuslimClub)
- **First Aid** - 6 videos (CPR & Choking, Allergies & Reactions, Minor Injuries, Burns & Scalds, Poisoning, Fever & Infection)

**Video API Endpoints:**

1. **Get Entertainment Channels:**
   ```javascript
   GET /api/entertainment/cartoons/channels
   GET /api/entertainment/lullabies/channels
   
   Response: { success: true, data: { channel: { icon, title, ... } } }
   ```

2. **Get Videos for Channel:**
   ```javascript
   GET /api/entertainment/cartoons/:cartoonKey
   GET /api/entertainment/lullabies/:lullabyKey
   
   Response: { success: true, data: [{ videoId, title, thumbnail, ... }] }
   ```

3. **First Aid Videos:**
   ```javascript
   GET /api/first-aid-videos/topics
   GET /api/first-aid-videos/:topic
   
   Response: { success: true, data: [...] }
   ```

4. **Add Videos:**
   ```javascript
   POST /api/videos/add
   
   Body: {
     type: "cartoon" | "lullaby" | "first_aid",
     channel: "channel_name",      // for cartoon/lullaby
     topic: "topic_name",          // for first_aid
     title: "Video Title",
     youtubeUrl: "https://youtube.com/watch?v=...",
     description: "Optional description"
   }
   ```

### Step 2: YouTube Setup (For Video URLs)

While videos are stored in MongoDB, they link to YouTube URLs. To add new videos:

1. Find YouTube video URLs
2. Use the `/api/videos/add` endpoint to store them in MongoDB
3. Add via `addFirstAidVideos.ps1` script (see backend folder)

**Example:**
```bash
# Videos stored in MongoDB with structure:
{
  _id: ObjectId,
  type: "cartoon",
  channel: "tom_jerry",
  title: "Tom & Jerry Episode 1",
  youtubeUrl: "https://www.youtube.com/watch?v=...",
  videoId: "extracted_id",
  thumbnail: "https://img.youtube.com/vi/.../0.jpg",
  addedBy: "admin",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Step 3: Video Management

---

## 📁 Project Structure

```
wombly/
├── App.js                          # Main navigation & entry point
├── apiConfig.js                    # API configuration (EDIT THIS FOR YOUR SETUP)
├── package.json                    # Frontend dependencies
├── metro.config.js                 # Expo configuration
├── index.js                        # Expo entry point
│
├── [Screen Files]                  # 25+ React Native screens
│  ├── LoginScreen.js
│  ├── SignUpScreen.js
│  ├── OTPVerificationScreen.js
│  └── ...other screens
│
├── components/
│  ├── FloatingChatButton.js
│  └── ui/                          # Shadcn/ui component library
│
├── hooks/                          # Custom React hooks
├── utils/                          # Utility functions & validation
├── assets/                         # Images and static files
│
└── backend/
    ├── server.js                   # Express server (MAIN)
    ├── .env                        # Configuration (EDIT THIS)
    ├── package.json                # Backend dependencies
    │
    ├── models/
    │  ├── User.js                  # Mongoose User schema
    │  └── Video.js                 # MongoDB Video schema (cartoon/lullaby/first_aid)
    │
    ├── services/
    │  └── otpService.js            # OTP generation & sending
    │
    └── addFirstAidVideos.ps1       # PowerShell script to add first aid videos to MongoDB
```

---

## 🚀 Getting Started

### Step 1: Setup Backend

```bash
cd backend
npm install

# Create .env file and configure:
# - MongoDB URI
# - Gmail credentials  
# - YouTube API Key
# - JWT secret
nano .env

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### Step 2: Setup Frontend

```bash
npm install

# Update API configuration
# Edit apiConfig.js and set API_BASE_URL to your machine's IP:
# - Physical Device: Your LAN IP (e.g., 192.168.x.x)
# - Android Emulator: http://10.0.2.2:5000
# - iOS Simulator: http://localhost:5000

# Start Expo
expo start

# Press 'a' for Android, 'i' for iOS, or scan QR with Expo Go
```

### Step 3: Test Flows

**Authentication Flow:**
1. Click "Sign Up"
2. Fill user information
3. Backend sends OTP to email
4. Check console for OTP
5. Enter OTP in verification screen
6. Receive JWT token and login

**Video Integration:**
1. Navigate to any guidance screen (Hygiene, First Aid, Nutrition, etc.)
2. App fetches relevant videos from YouTube
3. View video thumbnails and descriptions
4. Click to open in YouTube app

---

## 🔧 Configuration Files

### Frontend Configuration (`apiConfig.js`)
```javascript
export const API_BASE_URL = 'http://10.0.2.2:5000'; // Android emulator
// Change to your machine IP for physical devices
// Example: 'http://192.168.1.100:5000'
```

### Backend Configuration (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/wombly

# Email Service (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-16-char-app-password

# YouTube API
YOUTUBE_API_KEY=AIzaSyD...your-key

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in `.env`
- Verify MongoDB is on port 27017

**"OTP not sending"**
- Verify Gmail app password (16 chars, not regular password)
- Check `.env` has correct GMAIL_USER and GMAIL_PASSWORD
- Ensure less secure apps are allowed (or use app password)

**"YouTube videos not loading"**
- Check YOUTUBE_API_KEY in `.env`
- Verify API key has YouTube Data API v3 enabled
- Check quota hasn't exceeded 100/day
- Ensure API key isn't restricted to specific domains

### Frontend Issues

**"Cannot connect to backend"**
- Update API_BASE_URL in `apiConfig.js`
- For physical devices: use your machine's LAN IP
- For emulator: use 10.0.2.2 (Android) or localhost (iOS)
- Test connectivity: `curl http://your-ip:5000/api/health`

**"Import not found"**
- Run `npm install` in both root and backend directories
- Clear Expo cache: Press 'c' in Expo CLI
- Restart Expo: `expo start --clear`

**"Videos not displaying"**
- Check network connectivity
- Verify API_BASE_URL is accessible
- Open DevTools to see API errors
- Check YouTube API quota in Google Cloud Console

---

## 📊 API Endpoints Summary

### Authentication
- `POST /api/signup` - Register user
- `POST /api/verify-otp` - Verify email OTP
- `POST /api/login` - Login with email/password
- `POST /api/resend-otp` - Resend OTP code

### User Management
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user data
- `GET /api/health` - Health check

### YouTube Integration
- `GET /api/search-videos?q=query` - Search videos
- `GET /api/channel-videos?channelId=id` - Get channel videos
- `GET /api/playlist-videos?playlistId=id` - Get playlist videos

---

## 🎯 Key Features

✅ **Secure Authentication**
- Email OTP verification
- JWT token-based sessions
- Password hashing with bcrypt

✅ **Video Integration**
- YouTube API with safe search
- Optimized queries (no heavy dependencies)
- Thumbnail caching for performance

✅ **Health Modules**
- 40+ weeks of pregnancy guidance
- Trimester-specific information
- Postpartum recovery tracking
- Toddler care and nutrition

✅ **User Experience**
- Real-time notifications
- Activity tracking
- Milestone tracking
- AsyncStorage persistence

---

## 📝 Development Tips

1. **Local Testing:** Always check backend console for OTPs
2. **Quota Monitoring:** Cache YouTube results to reduce API calls
3. **Error Handling:** All screens include error boundaries
4. **Performance:** AsyncStorage prevents unnecessary network calls
5. **Security:** Never commit `.env` file to version control

---

## 📞 Support

For issues or questions:
1. Check backend console for detailed error logs
2. Review network requests in Expo DevTools
3. Verify `.env` configuration matches your setup
4. Ensure all prerequisites are installed
5. Test API endpoints with Postman first

---

This is a private project for the Wombly pregnancy care application.

---

**Last Updated:** February 2026  
**Status:** Production Ready ✅
