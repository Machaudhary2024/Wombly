# Wombly App - Connection Checklist

## ✅ Network Configuration Verified

### API Configuration
- **Frontend API URL**: `http://192.168.13.1:5000`
- **Backend Server**: Listening on `0.0.0.0:5000` (all interfaces)
- **MongoDB**: `mongodb://localhost:27017/wombly`
- **CORS**: Enabled on backend

### Navigation Routes
All routes are properly defined in App.js:
- ✅ Login → Home
- ✅ SignUp → OTPVerification → Home
- ✅ ForgotPassword → ResetPassword
- ✅ All feature screens connected

---

## 🚀 Startup Instructions

### Step 1: Start MongoDB
```powershell
mongod
```
Wait for message: "Waiting for connections on port 27017"

### Step 2: Start Backend Server
```powershell
cd backend
npm install
npm start
```
Wait for message: "MongoDB connected successfully"
And: "Wombly backend server running on port 5000"

### Step 3: Start Frontend (Expo)
```powershell
npm install
npx expo start
```
Then press `a` for Android Emulator or `i` for iOS Simulator

---

## 🔧 Troubleshooting Network Errors

### Error: "Cannot connect to server"
**Causes:**
1. Backend is not running
2. MongoDB is not running
3. Wrong IP address in apiConfig.js
4. Firewall blocking port 5000

**Solutions:**
1. Start backend: `cd backend && npm start`
2. Start MongoDB: `mongod`
3. Verify IP is correct: `ipconfig` (check VMware Network Adapter)
4. Allow port 5000 in firewall

### Error: "Database connection not available"
**Causes:**
1. MongoDB is not running
2. MongoDB connection string is wrong

**Solutions:**
1. Start MongoDB: `mongod`
2. Verify connection string in backend/server.js:
   - Default: `mongodb://localhost:27017/wombly`

### Error: "Invalid username or password"
**This is NORMAL** - User doesn't exist yet

**Solutions:**
1. Click "Sign Up"
2. Create a new account
3. Verify email with OTP
4. Then try login

---

## 📋 Login Flow Verification

### Correct Login Flow:
1. ✅ User enters email and password
2. ✅ Frontend sends POST to `/api/login`
3. ✅ Backend checks database
4. ✅ Backend verifies password
5. ✅ Backend returns token and user data
6. ✅ Frontend navigates to Home screen
7. ✅ HomeScreen displays userName

### What Backend Checks:
- User exists in database
- Email matches
- Password is correct
- Account is verified (isVerified = true)
- No database connection issues

---

## 📊 System Requirements Checklist

- [ ] MongoDB running on localhost:27017
- [ ] Backend running on http://0.0.0.0:5000
- [ ] Frontend API URL set to http://192.168.13.1:5000
- [ ] CORS enabled on backend
- [ ] All npm dependencies installed
- [ ] .env file configured (if needed for EMAIL_USER, EMAIL_PASSWORD)

---

## 🧪 Quick Test Commands

**Test Backend Health:**
```bash
curl http://192.168.13.1:5000/api/health
```

**Test Login Endpoint:**
```bash
curl -X POST http://192.168.13.1:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**Test MongoDB Connection:**
```bash
mongosh "mongodb://localhost:27017/wombly"
```

---

## 🛑 If Still Getting Network Errors

1. **Check Backend Logs:**
   - Look for errors in the terminal where `npm start` runs
   - Check MongoDB connection message
   
2. **Verify IP Address:**
   ```powershell
   ipconfig
   # Look for "VMware Network Adapter VMnet8" section
   # IPv4 Address should be 192.168.13.1
   ```

3. **Check Firewall:**
   - Allow Node.js through Windows Firewall
   - Or add port 5000 to allowed ports

4. **Restart Everything:**
   - Close MongoDB terminal
   - Close Backend terminal
   - Close Expo terminal
   - Start all three again in order

---

## ✨ Success Indicators

### When Everything is Working:
- ✅ No "Cannot connect to server" error
- ✅ Can see login success message
- ✅ HomeScreen shows user's name
- ✅ No network errors in console
- ✅ Smooth navigation between screens

### Console Messages You Should See:

**Backend:**
```
MongoDB connected successfully to: mongodb://localhost:27017/wombly
Wombly backend server running on port 5000
Login attempt from: test@example.com
Login successful
```

**Frontend:**
```
API Base URL: http://192.168.13.1:5000
Fetching from: http://192.168.13.1:5000/api/login
Response status: 200
Login successful!
```

---

## 📞 Support

If you still have issues:
1. Check all three services are running (MongoDB, Backend, Frontend)
2. Verify the IP address is correct
3. Check firewall settings
4. Restart all services in order
5. Check console logs for specific error messages
