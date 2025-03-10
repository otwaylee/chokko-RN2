import { create } from 'zustand';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { Alert } from 'react-native';
import apiClient from '@/api/apiClient';

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
}

export interface RecordItem {
  recordId: number;
  title: string;
  recordType: string;
  value?: string;
  unit?: string;
  categoryColor?: string;
  date?: string;
}

interface PetState {
  pets: Pet[];
  selectedPetId: string;

  setPets: (pets: Pet[]) => void;
  setSelectedPetId: (petId: string) => void;
  loadPetsFromStorage: () => Promise<void>;

  addPet: (petInfo: Pet) => Promise<void>;
  updatePet: (updatedPet: Pet) => Promise<void>;
  deletePet: (petId: number) => Promise<void>;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  selectedPetId: '',

  setPets: (pets) => set({ pets }),
  setSelectedPetId: (petId) => set({ selectedPetId: petId }),

  // ✅ SecureStore에서 Pets 불러오기
  loadPetsFromStorage: async () => {
    try {
      const storedUserInfo = await SecureStore.getItemAsync('userInfo');
      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        set({ pets: parsed.pets || [] });
      }
    } catch (error) {
      console.error('🚨 SecureStore에서 pets 로드 실패:', error);
    }
  },

  // ✅ 펫 추가
  addPet: async (petInfo) => {
    try {
      const token = await SecureStore.getItemAsync('session');
      if (!token) throw new Error('로그인이 필요합니다.');

      const response = await apiClient.post('/users/pets', petInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newPet = { ...petInfo, petId: response.data.petId };
      set((state) => ({ pets: [...state.pets, newPet] }));

      Alert.alert('✅ 반려동물이 추가되었습니다.');
    } catch (error) {
      console.error('🚨 펫 추가 실패:', error);
      Alert.alert('펫 추가 중 문제가 발생했습니다.');
    }
  },

  // ✅ 펫 수정
  updatePet: async (updatedPet) => {
    try {
      const token = await SecureStore.getItemAsync('session');
      if (!token) throw new Error('로그인이 필요합니다.');

      await apiClient.patch('/users/pets/${updatedPet.petId}', updatedPet, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        pets: state.pets.map((pet) =>
          pet.petId === updatedPet.petId ? updatedPet : pet
        ),
      }));
    } catch (error) {
      console.error('🚨 펫 수정 실패:', error);
      Alert.alert('펫 수정 중 문제가 발생했습니다.');
    }
  },

  // ✅ 펫 삭제
  deletePet: async (petId) => {
    try {
      const token = await SecureStore.getItemAsync('session');
      if (!token) throw new Error('로그인이 필요합니다.');

      await apiClient.delete('/users/pets/${petId}', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        pets: state.pets.filter((pet) => pet.petId !== petId),
      }));

      Alert.alert('✅ 반려동물이 삭제되었습니다.');
    } catch (error) {
      console.error('🚨 펫 삭제 실패:', error);
      Alert.alert('펫 삭제 중 문제가 발생했습니다.');
    }
  },
}));
