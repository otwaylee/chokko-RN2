import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { useUserStore } from '@/stores/useUserStore'; // ✅ Zustand Store
import PetProfile from '@/components/diary/PetProfile'; // ✅ 펫 프로필 컴포넌트
import CardList from '@/components/diary/CardList'; // ✅ 카드 리스트 컴포넌트

export default function Diary() {
  const { selectedPetId, setSelectedPetId, loadPetsFromLocalStorage, pets } =
    useUserStore();

  // ✅ 첫 마운트 시 로컬스토리지로부터 pets 불러오기
  useEffect(() => {
    loadPetsFromLocalStorage();
  }, [loadPetsFromLocalStorage]);

  // ✅ pet 프로필을 선택했을 때 실행될 함수
  const handleSelectPet = (petId: string) => {
    if (selectedPetId !== petId) {
      setSelectedPetId(petId);
    }
  };

  return (
    <View className='flex-1 bg-white p-5'>
      {/* ✅ 제목 */}
      <Text className='text-2xl font-semibold mb-4'>동물수첩</Text>

      {/* ✅ Pet Profile (펫 프로필 선택) */}
      <PetProfile onSelectPet={handleSelectPet} />

      {/* ✅ 카드 리스트 */}
      <ScrollView className='mt-4'>
        {selectedPetId ? (
          <CardList petId={selectedPetId} />
        ) : (
          <Text className='text-gray-500 text-center mt-4'>
            {pets.length === 0
              ? '등록된 펫이 없습니다. 새로운 펫을 추가해 주세요.'
              : '펫을 선택해주세요.'}
          </Text>
        )}
      </ScrollView>

      {/* ✅ 새로운 펫 추가 버튼 */}
      {pets.length === 0 && (
        <TouchableOpacity className='bg-primary p-3 rounded-lg mt-5 items-center'>
          <Text className='text-white text-lg'>펫 추가하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
