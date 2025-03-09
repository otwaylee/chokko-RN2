import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
  session: string | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,

  // 로그인 (토큰 저장)
  signIn: async (token) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('session', token);
    } else {
      await SecureStore.setItemAsync('session', token);
    }
    set({ session: token, isLoading: false });
  },

  // 로그아웃 (토큰 삭제)
  signOut: async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('session');
    } else {
      await SecureStore.deleteItemAsync('session');
    }
    set({ session: null, isLoading: false });
  },

  // 인증 상태 확인
  checkAuth: async () => {
    let token: string | null = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('session');
    } else {
      token = await SecureStore.getItemAsync('session');
    }
    set({ session: token, isLoading: false });
  },
}));
