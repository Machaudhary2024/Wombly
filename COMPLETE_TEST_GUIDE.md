# Wombly App - Complete System Test & Verification

## 🎯 Pre-Launch Checklist

### System Requirements
- [ ] Windows 10/11
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed
- [ ] Android Emulator or iOS Simulator (or physical device)

### Network Setup
- [ ] Machine IP: 192.168.13.1 (verify with `ipconfig`)
- [ ] Backend port: 5000 (not blocked by firewall)
- [ ] MongoDB port: 27017 (not blocked by firewall)

---

## 🚀 Step-by-Step Startup Guide

### Step 1: Verify Network Configuration

```powershell
# Check your machine IP
ipconfig

# Look for "VMware Network Adapter VMnet8" section
# Your IPv4 Address should appear (e.g., 192.168.13.1)
```

**Expected Output:**
```
VMware Network Adapter VMnet8:
   IPv4 Address. . . . . . . . . : 192.168.13.1
   Subnet Mask . . . . . . . . . : 255.255.255.0
```

**If different:** Update `apiConfig.js` with your actual IP

### Step 2: Start MongoDB (Terminal 1)

```powershell
# Create data directory if it doesn't exist
mkdir C:\data\db -Force

# Start MongoDB
mongod --dbpath C:\data\db
```

**Expected Output:**
```
[initandlisten] waiting for connections on port 27017
```

✅ **Success** - MongoDB is running

### Step 3: Start Backend (Terminal 2)

```powershell
cd backend
npm install  # Only needed if packages missing
npm start
```

**Expected Output:**
```
MongoDB connected successfully to: mongodb://localhost:27017/wombly
Wombly backend server running on port 5000
```

✅ **Success** - Backend is running

### Step 4: Test Backend Health

In a new terminal:
```powershell
# Quick test
curl http://192.168.13.1:5000/api/health

# Or use Invoke-WebRequest in PowerShell
Invoke-WebRequest -Uri "http://192.168.13.1:5000/api/health" | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "mongoDBStatus": "connected",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

✅ **Success** - Backend is healthy

### Step 5: Start Frontend (Terminal 3)

```powershell
# From project root
npx expo start
```

**Expected Output:**
```
Starting Metro Bundler
Press 'a' to open Android
Press 'i' to open iOS
Press 'w' to open web
```

✅ **Success** - Frontend is running

### Step 6: Launch the App

- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Or scan QR code with physical device

---

## 🧪 Login Test Procedure

### Test Case 1: New User Registration

1. **On Login Screen:**
   - Click "Don't have an account? Sign Up"

2. **On Sign Up Screen:**
   - Name: `Test User`
   - Age: `25`
   - Email: `test@example.com`
   - Phone: `03001234567`
   - Password: `Test@123`
   - Pregnancy Week: `12`
   - Click "Sign Up"

3. **Expected Result:**
   - ✅ Email verification OTP sent
   - ✅ Navigation to OTP Verification screen

4. **On OTP Screen:**
   - Check backend console for OTP
   - Example: `[DEBUG] OTP for test@example.com: 123456`
   - Or check email for OTP
   - Enter OTP and click "Verify"

5. **Expected Result:**
   - ✅ Account verified message
   - ✅ Automatic navigation to Home screen
   - ✅ User name displayed: "Test User"

### Test Case 2: Existing User Login

1. **On Login Screen:**
   - Email: `test@example.com`
   - Password: `Test@123`
   - Click "Login"

2. **Expected Sequence:**
   ```
   Loading... (2-3 seconds)
   ↓
   HomeScreen appears
   ↓
   Success message displays
   ↓
   User name shows: "Test User"
   ```

3. **Backend Console Should Show:**
   ```
   [api] req POST http://192.168.13.1:5000/api/login
   [api] res 200 OK http://192.168.13.1:5000/api/login 245ms
   Login successful
   ```

4. **Frontend Console Should Show:**
   ```
   API Base URL: http://192.168.13.1:5000
   Fetching from: http://192.168.13.1:5000/api/login
   Response status: 200
   Response data: {success: true, user: {...}}
   ```

---

## ❌ Troubleshooting Network Errors

### Error 1: "Cannot connect to server"

**What it means:** Frontend cannot reach backend

**Causes:**
1. Backend is not running
2. IP address is wrong
3. Port is blocked by firewall

**Solutions:**

```powershell
# Check if backend is running
netstat -an | findstr :5000

# If no output, start backend:
cd backend
npm start

# Check if firewall is blocking
netsh advfirewall firewall add rule name="Node.js 5000" dir=in action=allow protocol=tcp localport=5000

# Check IP is correct
ipconfig | findstr "IPv4"
# Update if different: apiConfig.js
```

### Error 2: "Database connection not available"

**What it means:** Backend cannot reach MongoDB

**Causes:**
1. MongoDB is not running
2. MongoDB crashed
3. Port 27017 is blocked

**Solutions:**

```powershell
# Start MongoDB
mongod --dbpath C:\data\db

# Verify MongoDB is running
netstat -an | findstr :27017

# Check MongoDB directly
mongosh "mongodb://localhost:27017/wombly"
```

### Error 3: "Invalid username or password"

**What it means:** Login credentials are incorrect (THIS IS NORMAL for new users)

**Solutions:**
1. Create a new account via Sign Up
2. Verify email with OTP
3. Then use that account to login

### Error 4: "Account not verified"

**What it means:** User exists but email not verified

**Solutions:**
1. Check spam folder for verification email
2. Check backend console for OTP
3. Use OTP to verify on OTP screen
4. Try login again after verification

### Error 5: Long loading screen (>5 seconds)

**What it means:** Backend is slow or request stuck

**Solutions:**
1. Check backend console for errors
2. Restart backend:
   ```powershell
   # Kill existing process
   Get-Process node | Stop-Process
   # Restart
   cd backend
   npm start
   ```
3. Check MongoDB is running
4. Check network connection quality

---

## ✅ Full Test Checklist

### Before Login
- [ ] MongoDB running (`mongod` terminal shows "waiting for connections")
- [ ] Backend running (`npm start` terminal shows "port 5000")
- [ ] Frontend running (`npx expo start` shows QR code)
- [ ] Device/Emulator connected
- [ ] IP address verified (192.168.13.1 or your machine IP)

### During Login
- [ ] No loading errors
- [ ] No network error messages
- [ ] HomeScreen appears within 3 seconds
- [ ] User name is displayed
- [ ] Success message appears

### After Login
- [ ] Can click menu items
- [ ] Can navigate between screens
- [ ] No connection errors when opening new screens
- [ ] Back button works
- [ ] All features are responsive

### Database Verification
- [ ] User exists in MongoDB
- [ ] User is marked as verified
- [ ] Password is correct
- [ ] Email matches

---

## 🔧 Advanced Debugging

### View Backend Logs in Detail

```powershell
# In backend terminal, check for:
[api] req POST /api/login  # Request received
[api] res 200 OK           # Success response
Login error: ...            # Any errors
```

### View Frontend Console Logs

In Expo app:
1. Shake device or press Dev Menu
2. Select "Open JS Debugger"
3. Open browser DevTools (F12)
4. Check Console tab for logs

### Test API Directly

```powershell
# Create test user
curl -X POST http://192.168.13.1:5000/api/signup `
  -Header "Content-Type: application/json" `
  -Body '{
    "name":"Test",
    "email":"test@test.com",
    "password":"Test@123",
    "phone":"03001234567",
    "age":"25"
  }'

# Login with credentials
curl -X POST http://192.168.13.1:5000/api/login `
  -Header "Content-Type: application/json" `
  -Body '{
    "email":"test@test.com",
    "password":"Test@123"
  }'
```

### Check MongoDB Data

```powershell
# Connect to MongoDB
mongosh "mongodb://localhost:27017/wombly"

# View all users
db.users.find()

# View specific user
db.users.findOne({email: "test@test.com"})

# Count users
db.users.countDocuments()
```

---

## 🎉 Success Indicators

When everything is working correctly:

✅ **All Three Services Running:**
- MongoDB: Terminal 1 shows "waiting for connections"
- Backend: Terminal 2 shows "port 5000"
- Frontend: Terminal 3 shows QR code

✅ **Quick Startup:**
- Click "Login" button
- No loading delay
- HomeScreen appears immediately
- User name shows up

✅ **No Error Messages:**
- No red error popups
- No console errors
- No network timeouts

✅ **Smooth Navigation:**
- Can click any menu item
- Screens load instantly
- No connection issues between screens

---

## 📊 Quick Reference

| Service | Port | URL | Status Check |
|---------|------|-----|--------------|
| MongoDB | 27017 | localhost:27017 | `netstat -an \| findstr :27017` |
| Backend | 5000 | 192.168.13.1:5000 | `curl http://192.168.13.1:5000/api/health` |
| Frontend | (Expo) | Device/Emulator | Scan QR code |

---

## 📞 Still Having Issues?

1. **Restart everything in order:**
   ```powershell
   # Terminal 1: MongoDB
   mongod --dbpath C:\data\db
   
   # Terminal 2: Backend (wait 3 seconds)
   cd backend && npm start
   
   # Terminal 3: Frontend (wait 3 seconds)
   npx expo start
   ```

2. **Check all three terminals for errors**

3. **Verify IP with:** `ipconfig | findstr "IPv4"`

4. **Update apiConfig.js** if IP is different

5. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   cd backend && npm install
   ```

6. **Restart emulator/device**

7. **Check firewall** allows Node.js on port 5000

---

**You're ready to go!** 🚀
