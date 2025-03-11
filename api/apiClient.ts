import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
});

// ✅ 특정 API 요청에서는 `Authorization` 헤더 제외
const NO_AUTH_ENDPOINTS = [
  '/users/check-email',
  '/users/login',
  '/users/register',
];

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');

  // 🔥 로그인, 회원가입, 이메일 중복 확인 요청은 Authorization 제거
  if (token && !NO_AUTH_ENDPOINTS.includes(config.url || '')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
