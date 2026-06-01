@echo off
REM Wombly App Startup Script
REM This script starts MongoDB, Backend, and Frontend in the correct order

echo.
echo ====================================
echo  WOMBLY APP STARTUP SCRIPT
echo ====================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: This script is not running as administrator.
    echo Some features may not work properly.
    echo Please run Command Prompt as Administrator.
    echo.
)

echo Step 1: Starting MongoDB...
echo ====================================
echo.
start cmd /k "mongod --dbpath C:\data\db"
echo MongoDB window opened. Waiting 3 seconds...
timeout /t 3 /nobreak
echo.

echo Step 2: Starting Backend Server...
echo ====================================
cd backend
echo.
start cmd /k "npm start"
echo Backend window opened. Waiting 3 seconds...
timeout /t 3 /nobreak
cd ..
echo.

echo Step 3: Starting Frontend (Expo)...
echo ====================================
echo.
start cmd /k "npx expo start"
echo Frontend window opened.
echo.

echo.
echo ====================================
echo ✓ All services starting!
echo ====================================
echo.
echo WHAT TO DO NEXT:
echo 1. Check MongoDB window for "Waiting for connections"
echo 2. Check Backend window for "MongoDB connected"
echo 3. In Frontend window, press 'a' for Android or 'i' for iOS
echo.
echo IMPORTANT: Keep all three windows open!
echo.
echo To login:
echo - Use an existing account, or
echo - Click "Sign Up" to create a new account
echo.
pause
