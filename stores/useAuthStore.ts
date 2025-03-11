import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface User {
  username?: string;
  email?: string;
  phone_number?: string;
  phone_country?: string;
  gender?: string;
  user_id?: number;
  bio?: string;
  profileImageUrl?: string;
  pets?: Pet[];
  date_of_birth?: string;
}

export interface Pet {
  petId?: number;
  pet_name: string;
  species: string;
  pet_registration_number: string;
  date_of_birth: string;
  gender: string;
  breed: string;
  neutering: string;
  imageUrl?: string;
  records?: RecordItem[];
  isNew?: boolean;
}

export interface RecordItem {
  recordId: number;
  emoticon?: string;
  title: string;
  recordType: string;
  value?: string;
  unit?: string;
  categoryColor?: string;
  date?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User, token: string) => Promise<void>;
  clearUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  // ✅ 로그인 (사용자 정보 & 토큰 저장)
  signIn: async (user, token) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      }

      set({ user, token, isLoading: false });
    } catch (error) {
      console.error('🚨 로그인 중 오류 발생:', error);
    }
  },

  // ✅ 상태 설정 및 SecureStore 업데이트
  setUser: async (user, token) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      }

      set({ user, token });
    } catch (error) {
      console.error('🚨 사용자 정보 설정 중 오류 발생:', error);
    }
  },

  // ✅ 로그아웃 (SecureStore & 상태 초기화)
  signOut: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      } else {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userInfo');
      }

      set({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error('🚨 로그아웃 중 오류 발생:', error);
    }
  },

  // ✅ 앱 실행 시 로그인 상태 확인
  checkAuth: async () => {
    try {
      let token: string | null = null;
      let storedUserInfo: string | null = null;

      if (Platform.OS === 'web') {
        token = localStorage.getItem('authToken');
        storedUserInfo = localStorage.getItem('userInfo');
      } else {
        token = await SecureStore.getItemAsync('authToken');
        storedUserInfo = await SecureStore.getItemAsync('userInfo');
      }

      const user = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      set({ user, token, isLoading: false });
    } catch (error) {
      console.error('🚨 인증 상태 확인 중 오류 발생:', error);
    }
  },

  // ✅ 모든 사용자 정보 초기화
  clearUser: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      } else {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userInfo');
      }

      set({ user: null, token: null });
    } catch (error) {
      console.error('🚨 사용자 정보 초기화 중 오류 발생:', error);
    }
  },
}));
