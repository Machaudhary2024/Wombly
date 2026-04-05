// apiConfig.js
// Uses React Native Platform to reliably detect environment.
// Physical Android/iOS devices need your machine's LAN IP.
// Web browser uses localhost.

import { Platform } from 'react-native';

const MACHINE_IP = ' 10.100.13.88';

let API_URL;

if (Platform.OS === 'web') {
  API_URL = process.env.WOMBLY_API_URL || 'http://localhost:5000';
} else {
  // Android / iOS — use machine LAN IP
  API_URL = process.env.WOMBLY_API_URL || `http://${MACHINE_IP}:5000`;
}

export const API_BASE_URL = API_URL;