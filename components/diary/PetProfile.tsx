import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { usePetStore } from '@/stores/usePetStore'; // ✅ Zustand Store
import EditPetProfileModal from './EditPetProfileModal'; // ✅ 프로필 수정 모달
import PetProfileList from '@/components/diary/PetProfileList'; // ✅ 프로필 리스트 컴포넌트

interface PetProfileProps {
  onSelectPet: (petId: string) => void;
}

const defaultImageUrl = require('@/assets/images/defaultPet.svg'); // ✅ RN에서는 require 사용

const PetProfile: React.FC<PetProfileProps> = ({ onSelectPet }) => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    addPet,
    updatePet,
    deletePet,
  } = usePetStore();

  const [isEditing, setIsEditing] = useState(false);

  // ✅ 현재 선택된 펫이 몇 번째 index인지 찾기
  const selectedProfileIndex = pets.findIndex(
    (pet) => String(pet.petId) === String(selectedPetId)
  );
  const safeIndex = selectedProfileIndex >= 0 ? selectedProfileIndex : 0;
  const currentPet = pets[safeIndex];

  // ✅ 프로필 수정 모달 열기/닫기
  const toggleEditModal = () => setIsEditing((prev) => !prev);

  // ✅ 특정 프로필 선택
  const handleSelectProfile = (index: number) => {
    const petId = pets[index]?.petId;
    if (petId) {
      setSelectedPetId(String(petId));
      onSelectPet(String(petId)); // 상위에도 전달
    }
  };

  // ✅ 새 프로필 추가
  const handleAddProfile = async () => {
    const newPet = {
      pet_name: '',
      species: '',
      pet_registration_number: '',
      date_of_birth: '',
      gender: 'M',
      breed: '???',
      neutering: 'N',
      imageUrl: defaultImageUrl,
      records: [],
      isNew: true,
    };

    try {
      await addPet(newPet);
      handleSelectProfile(pets.length); // 선택
      setIsEditing(true);
    } catch (error) {
      Alert.alert('오류', '프로필 생성 중 문제가 발생했습니다.');
    }
  };

  // ✅ 펫 정보 저장
  const handleSave = async (updatedPet: any) => {
    try {
      await updatePet(updatedPet);
      toggleEditModal();
    } catch (error) {
      Alert.alert('오류', '프로필 저장 중 문제가 발생했습니다.');
    }
  };

  // ✅ 펫 삭제
  const handleDeletePet = async (petId: number) => {
    try {
      await deletePet(petId);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <View className='p-4'>
      <PetProfileList
        profiles={pets}
        onAddProfile={handleAddProfile}
        onSelectProfile={handleSelectProfile}
        selectedProfileIndex={safeIndex}
      />

      {currentPet ? (
        <View className='bg-[#E0F3F4] p-5 rounded-lg mt-4 border-2'>
          <View className='flex-row justify-between items-center mb-2'>
            <Text className='text-xl font-bold'>{currentPet.pet_name}</Text>
            <TouchableOpacity onPress={toggleEditModal}>
              <Text className='text-lg'>✏️</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row justify-between'>
            <View className='w-1/2'>
              <Text className='text-base'>
                <Text className='font-bold'>등록번호: </Text>
                {currentPet.pet_registration_number}
              </Text>
              <Text className='text-base'>
                <Text className='font-bold'>생년월일: </Text>
                {currentPet.date_of_birth}
              </Text>
              <Text className='text-base'>
                <Text className='font-bold'>성별: </Text>
                {currentPet.gender === 'M' ? '수컷♂' : '암컷♀'}
              </Text>
              <Text className='text-base'>
                <Text className='font-bold'>품종: </Text>
                {currentPet.breed}
              </Text>
              <Text className='text-base'>
                <Text className='font-bold'>중성화: </Text>
                {currentPet.neutering === 'Y' ? 'O' : 'X'}
              </Text>
            </View>
            <Image
              source={
                typeof currentPet.imageUrl === 'string'
                  ? { uri: currentPet.imageUrl }
                  : defaultImageUrl
              }
              className='w-32 h-32 rounded-lg'
            />
          </View>
        </View>
      ) : (
        <Text className='text-gray-500 text-center mt-4'>
          프로필이 없습니다. 새 프로필을 추가해주세요.
        </Text>
      )}

      {isEditing && currentPet && (
        <EditPetProfileModal
          petInfo={currentPet}
          onSave={handleSave}
          onClose={toggleEditModal}
          onDelete={handleDeletePet}
        />
      )}
    </View>
  );
};

export default PetProfile;
