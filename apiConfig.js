import { Platform } from 'react-native';
import Constants from 'expo-constants';

const WEB_API_BASE_URL = 'http://localhost:5000';

const getExpoHostIp = () => {
	const hostUri =
		Constants.expoConfig?.hostUri ||
		Constants.manifest2?.extra?.expoGo?.debuggerHost ||
		Constants.manifest?.debuggerHost;

	if (!hostUri || typeof hostUri !== 'string') {
		return null;
	}

	return hostUri.split(':')[0] || null;
};

const getNativeApiBaseUrl = () => {
	const hostIp = getExpoHostIp();

	if (hostIp) {
		return `http://${hostIp}:5000`;
	}

	// Android emulator fallback for local machine loopback.
	if (Platform.OS === 'android') {
		return 'http://10.0.2.2:5000';
	}

	return 'http://localhost:5000';
};

export const API_BASE_URL = Platform.OS === 'web' ? WEB_API_BASE_URL : getNativeApiBaseUrl();
