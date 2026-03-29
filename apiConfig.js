// For web/local development
const isWeb = typeof window !== 'undefined' && !navigator.userAgent.includes('Expo');

// For mobile/Expo - use machine IP address
export const API_BASE_URL = isWeb ? 'http://localhost:5000' : 'http://your-local-ip:5000';
