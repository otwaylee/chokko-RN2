import axios from 'axios';

import * as SecureStore from 'expo-secure-store';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 시 `Authorization` 헤더 자동 추가
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
