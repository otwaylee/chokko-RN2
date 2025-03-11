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

export interface CardItem {
  title: string;
  recordType: string;
  unit?: string;
  value?: string;
  category_color?: string;
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
  addRecord: (
    petId: string,
    newCard: Omit<RecordItem, 'recordId'>
  ) => Promise<void>;

  /** 레코드(카드) 관련 예시 */
  removeRecord: (petId: string, recordId: number) => Promise<void>;
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
      const token = await SecureStore.getItemAsync('authToken');
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
      const token = await SecureStore.getItemAsync('authToken');
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
      const token = await SecureStore.getItemAsync('authToken');
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
  addRecord: async (petId: string, newCard: Omit<RecordItem, 'recordId'>) => {
    try {
      // 1) 토큰 가져오기
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) throw new Error('로그인이 필요합니다.');

      // 2) 서버에 데이터 저장 (카테고리 생성)
      const response = await apiClient.post(
        `/records/category?pet_id=${petId}`,
        newCard,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const createdRecord = response.data;

      // 3) 전역 상태(pets) 업데이트
      set((state) => {
        const updatedPets = state.pets.map((pet) => {
          if (String(pet.petId) === String(petId)) {
            return {
              ...pet,
              records: [...(pet.records ?? []), createdRecord],
            };
          }
          return pet;
        });
        return { pets: updatedPets };
      });

      // 4) SecureStore에 업데이트된 정보 저장
      const storedUserInfo = await SecureStore.getItemAsync('userInfo');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        parsedUserInfo.pets = parsedUserInfo.pets.map((p: Pet) => {
          if (String(p.petId) === String(petId)) {
            return {
              ...p,
              records: [...(p.records || []), createdRecord],
            };
          }
          return p;
        });

        await SecureStore.setItemAsync(
          'userInfo',
          JSON.stringify(parsedUserInfo)
        );
      }
    } catch (error) {
      console.error('카드(레코드) 생성 중 오류:', error);
      throw error;
    }
  },

  removeRecord: async (petId: string, recordId: number) => {
    try {
      // 1) 토큰 가져오기
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) throw new Error('로그인이 필요합니다.');

      // 2) 서버에 삭제 요청
      await apiClient.delete(`/records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3) 전역 pets 상태에서 해당 recordId 제거
      set((state) => {
        const updatedPets = state.pets.map((pet) => {
          if (String(pet.petId) === String(petId)) {
            return {
              ...pet,
              records: pet.records?.filter((rec) => rec.recordId !== recordId),
            };
          }
          return pet;
        });
        return { pets: updatedPets };
      });

      // 4) SecureStore 반영
      const storedUserInfo = await SecureStore.getItemAsync('userInfo');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        parsedUserInfo.pets = parsedUserInfo.pets.map((pet: Pet) => {
          if (String(pet.petId) === String(petId)) {
            return {
              ...pet,
              records: pet.records?.filter(
                (rec: RecordItem) => rec.recordId !== recordId
              ),
            };
          }
          return pet;
        });

        await SecureStore.setItemAsync(
          'userInfo',
          JSON.stringify(parsedUserInfo)
        );
      }
    } catch (error) {
      console.error('레코드 삭제 중 오류:', error);
      throw error;
    }
  },
}));
