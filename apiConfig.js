// Determine environment and set API base URL
// For web/browser on same machine: localhost:5000
// For Expo Go on Android emulator: 10.0.2.2:5000
// For Expo Go on physical device/iOS: your machine's IP:5000

const isWeb = typeof window !== 'undefined';
const isAndroidEmulator = typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Linux');

let API_URL = 'http://10.106.209.126:5000'; // use your machine's IP address for both web and physical devices by default

if (!isWeb) {
  // React Native environment
  if (isAndroidEmulator) {
    // Android emulator uses 10.0.2.2 to access host machine
    API_URL = 'http://10.0.2.2:5000';
  } else {
    // iOS simulator or physical device - use your machine IP
    // Change 192.168.29.1 to your machine's IP if needed
    API_URL = 'http://10.106.209.126:5000';
  }
}

export const API_BASE_URL = API_URL;
