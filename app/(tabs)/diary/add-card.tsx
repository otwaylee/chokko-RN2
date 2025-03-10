import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Picker } from '@react-native-picker/picker';
import { usePetStore } from '@/stores/usePetStore';

const AddCard: React.FC = () => {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [dataType, setDataType] = useState<'그래프 형식' | '글/사진 형식'>(
    '그래프 형식'
  );
  const [unit, setUnit] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-gray-200');

  // ✅ Zustand에서 필요한 상태/함수 가져오기
  const { selectedPetId, setSelectedPetId, addRecord } = usePetStore();

  const colors = [
    'bg-card-skyblue',
    'bg-card-pink',
    'bg-card-lavender',
    'bg-card-ivory',
  ];

  useEffect(() => {
    const storedPetId = selectedPetId || null;
    if (!selectedPetId && storedPetId) {
      setSelectedPetId(storedPetId);
    }
  }, [selectedPetId, setSelectedPetId]);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      Alert.alert('오류', '항목 이름을 입력해주세요.');
      return;
    }
    if (!selectedPetId) {
      Alert.alert('오류', '유효한 반려동물 ID가 없습니다.');
      return;
    }

    const newCard = {
      title: categoryName,
      recordType: dataType === '그래프 형식' ? 'GRAPH' : 'PHOTO',
      unit: dataType === '그래프 형식' ? unit : undefined,
      categoryColor: selectedColor,
    };

    try {
      await addRecord(selectedPetId, newCard);
      Alert.alert('성공', '카테고리가 성공적으로 추가되었습니다.');
      router.push('/(tabs)/diary');
    } catch (error) {
      console.error('카테고리 생성 중 오류:', error);
      Alert.alert('오류', '카테고리를 생성하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View className='flex-1 p-4 bg-white'>
      {/* 헤더 (뒤로가기 버튼) */}
      <TouchableOpacity onPress={() => router.back()} className='mb-4'>
        <Text className='text-lg text-blue-500'>{'< 뒤로가기'}</Text>
      </TouchableOpacity>

      <Text className='text-xl font-bold mb-4'>새 항목 만들기</Text>

      {/* 항목 이름 입력 */}
      <View className='mb-4'>
        <Text className='mb-2 text-base'>항목 이름</Text>
        <TextInput
          className='w-full border border-gray-300 p-3 rounded-md'
          placeholder='항목 이름을 입력하세요'
          value={categoryName}
          onChangeText={setCategoryName}
        />
      </View>

      {/* 데이터 타입 선택 (Picker 사용) */}
      <View className='mb-4'>
        <Text className='mb-2 text-base'>데이터 타입</Text>
        <View className='border border-gray-300 rounded-md'>
          <Picker
            selectedValue={dataType}
            onValueChange={(itemValue) => setDataType(itemValue)}>
            <Picker.Item label='그래프 형식' value='그래프 형식' />
            <Picker.Item label='글/사진 형식' value='글/사진 형식' />
          </Picker>
        </View>
      </View>

      {/* 그래프 형식일 경우 단위 입력 */}
      {dataType === '그래프 형식' && (
        <View className='mb-4'>
          <Text className='mb-2 text-base'>단위</Text>
          <TextInput
            className='w-full border border-gray-300 p-3 rounded-md'
            placeholder='예: kg, cm 등'
            value={unit}
            onChangeText={setUnit}
          />
        </View>
      )}

      {/* 카드 색상 선택 */}
      <View className='mb-4'>
        <Text className='mb-2 text-base'>카드 색상</Text>
        <View className='flex-row space-x-4'>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              className={`w-10 h-10 rounded-full ${color} border-2 ${
                selectedColor === color ? 'border-black' : 'border-transparent'
              }`}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity
        onPress={handleSubmit}
        className='bg-blue-500 p-4 rounded-lg mt-6 items-center'>
        <Text className='text-white text-lg'>항목 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddCard;
