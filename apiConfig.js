// For web/local development
const isWeb = typeof window !== 'undefined' && !navigator.userAgent.includes('Expo');

// For mobile/Expo - use machine IP address
export const API_BASE_URL = isWeb ? 'http://localhost:5000' : 'http://10.231.129.8:5000';
