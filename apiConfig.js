// Environment detection
const isWeb = typeof window !== 'undefined';
const isAndroidEmulator =
  !isWeb &&
  typeof navigator !== 'undefined' &&
  navigator.userAgent?.includes('Linux');

// API URL resolution priority:
// 1. Environment variable (works for all platforms)
// 2. Android emulator default (10.0.2.2 maps to host machine)
// 3. Web dev default (localhost)
// 4. Physical device / iOS simulator (set your machine's IP here)
const MACHINE_IP = '10.11.117.126';

let API_URL;

if (process.env.WOMBLY_API_URL) {
  API_URL = process.env.WOMBLY_API_URL;
} else if (isWeb) {
  API_URL = 'http://localhost:5000';
} else if (isAndroidEmulator) {
  API_URL = 'http://10.0.2.2:5000';
} else {
  API_URL = `http://${MACHINE_IP}:5000`;
}

if (process.env.NODE_ENV !== 'production') {
  console.log('API config —', {
    platform: isWeb ? 'Web' : 'Mobile',
    androidEmulator: isAndroidEmulator,
    url: API_URL,
  });
}

export const API_BASE_URL = API_URL;