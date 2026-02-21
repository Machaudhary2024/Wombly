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

#### For Gmail Users:

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

#### For Other Email Services:

**SendGrid:**
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@yourapp.com
```

**AWS SES:**
```env
EMAIL_SERVICE=aws-ses
AWS_SES_USER=your-ses-user
AWS_SES_PASSWORD=your-ses-password
EMAIL_FROM=your-verified-email@domain.com
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

### Step 2: Create API Key

1. **Generate Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API Key

2. **Restrict API Key (Security):**
   - Click on your API Key
   - Under "Application restrictions": Select "Android apps"
   - Add package name: `com.wombly.app`
   - Under "API restrictions": Select "YouTube Data API v3"
   - Click "Save"

3. **Update Backend `.env`:**
   ```env
   YOUTUBE_API_KEY=AIzaSyD...your-key-here...
   ```

### Step 3: YouTube Service Configuration

**File:** `backend/services/youtubeService.js`

The service uses native `fetch` API (no external dependencies):
- Builds optimized YouTube API queries
- Implements safe search filter
- Returns formatted video results
- Handles errors gracefully

**Key Functions:**
```javascript
searchVideos(query, maxResults)     // Search by keyword
getChannelVideos(channelId)         // Get channel videos
getPlaylistVideos(playlistId)       // Get playlist videos
```

**Configuration (`backend/services/config.js`):**
```javascript
{
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  API_BASE_URL: 'https://www.googleapis.com/youtube/v3',
  MAX_RESULTS: 10,              // Videos per request
  SAFE_SEARCH: 'strict',        // Filter inappropriate content
  VIDEO_TYPE: 'video'           // Only videos, no channels/playlists
}
```

### Step 4: Backend API Endpoints

**Search Videos:**
```javascript
GET /api/search-videos?q=pregnancy+nutrition&maxResults=10

Response:
{
  success: true,
  videos: [
    {
      id: "video-id",
      title: "Healthy Pregnancy Diet",
      description: "Guide to nutrition during pregnancy",
      thumbnail: "https://i.ytimg.com/vi/...",
      url: "https://www.youtube.com/watch?v=..."
    }
  ]
}
```

**Get Channel Videos:**
```javascript
GET /api/channel-videos?channelId=UCxxxxx&maxResults=10

Response: { success: true, videos: [...] }
```

**Get Playlist Videos:**
```javascript
GET /api/playlist-videos?playlistId=PLxxxxx&maxResults=10

Response: { success: true, videos: [...] }
```

### Step 5: Frontend Integration

**Screens Using YouTube:**
- `HygieneGuidanceScreen.js` - Hygiene and first aid videos
- `FirstAidGuidanceScreen.js` - Emergency first aid guidance
- `NutritionGuideScreen.js` - Nutrition and diet videos
- `DosDontsScreen.js` - Do's and don'ts for pregnancy
- `EntertainmentModule.js` - Lullabies and cartoons for toddlers

**Example Usage:**
```javascript
import { API_BASE_URL } from './apiConfig';

const fetchVideos = async (topic) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/search-videos?q=${topic}&maxResults=10`
    );
    const data = await response.json();
    setVideos(data.videos);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
  }
};
```

### Step 6: Quota Management

**Free Tier Limits:**
- 100 queries per day
- ~10 API units per search query
- Equivalent to ~10 searches/day

**Optimization Tips:**
1. Cache search results locally (AsyncStorage)
2. Batch requests when possible
3. Implement pagination for large results
4. Use specific search terms for better results
5. Cache video metadata for 24 hours

**Quota Monitoring:**
- Check usage: [Google Cloud Console Quotas](https://console.cloud.google.com/apis/dashboard)
- Upgrade to paid plan for more requests
- Set quotas to prevent overage

### YouTube API Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "API Key invalid" | Key not set or expired | Verify API_KEY in `.env` |
| "API not enabled" | YouTube Data API not enabled | Enable in Google Cloud Console |
| "Quota exceeded" | Used 100 daily queries | Wait until next day or upgrade |
| "Videos not loading" | API key missing permissions | Regenerate key and restrict properly |
| "No results found" | Poor search query | Use specific keywords (e.g., "pregnancy week 20") |

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
    ├── users-db.json               # MongoDB database
    │
    ├── models/
    │  └── User.js                  # Mongoose User schema
    │
    └── services/
       ├── config.js                # Centralized configuration
       ├── otpService.js            # OTP generation & sending
       ├── youtubeService.js        # YouTube API integration
       └── entertainmentService.js  # Entertainment channels
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

## 📄 License

This is a private project for the Wombly pregnancy care application.

---

**Last Updated:** February 2026  
**Status:** Production Ready ✅
