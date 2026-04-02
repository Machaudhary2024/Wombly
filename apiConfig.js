// Determine environment and set API base URL
// For web/browser on same machine: localhost:5000
// For Expo Go on Android emulator: 10.0.2.2:5000
// For Expo Go on physical device/iOS: your machine's IP:5000

const isWeb = typeof window !== 'undefined';
const isAndroidEmulator = typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Linux');

// Get machine IP from environment or use defaults
// For development, you can set WOMBLY_API_URL environment variable
let API_URL = process.env.WOMBLY_API_URL || 'http://10.11.117.126:5000';

if (!isWeb) {
  // React Native environment
  if (isAndroidEmulator) {
    // Android emulator uses 10.0.2.2 to access host machine
    API_URL = process.env.WOMBLY_API_URL || 'http://10.0.2.2:5000';
  } else {
    // iOS simulator or physical device - use your machine IP
    // To change: export WOMBLY_API_URL=http://YOUR_IP:5000 before running
    API_URL = process.env.WOMBLY_API_URL || 'http://10.11.117.126:5000';
  }
}

// For web development with localhost
if (isWeb && !process.env.WOMBLY_API_URL) {
  // Try localhost first for web development
  API_URL = 'http://localhost:5000';
  console.log('Using localhost for web development. API URL:', API_URL);
}

// Add debugging info in development
if (process.env.NODE_ENV !== 'production') {
  console.log('API Configuration - Platform:', isWeb ? 'Web' : 'Mobile', ', Emulator:', isAndroidEmulator, ', API_URL:', API_URL);
}

export const API_BASE_URL = API_URL;
