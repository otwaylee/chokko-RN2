import { useUserStore } from '@/stores/useUserStore';

import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Card from './Card';
import { usePetStore } from '@/stores/usePetStore';

interface CardListProps {
  petId: number | string;
}

interface RecordsData {
  graph_data: number;
  graph_date?: string;
}

const CardList: React.FC<CardListProps> = ({ petId }) => {
  const router = useRouter();
  const { pets, removeRecord } = usePetStore();

  // 현재 선택된 펫 찾기
  const currentPet = pets.find((p) => String(p.petId) === String(petId));

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // 최신 데이터 fetch 함수
  const fetchLatestData = async (recordId: number, recordType: string) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const token = 'your-auth-token'; // localStorage 대체 필요
      const response = await fetch(
        `${API_URL}/records/${
          recordType === 'GRAPH' ? 'graph' : 'photo'
        }/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (recordType === 'GRAPH' && data.graphDataList?.length) {
        const sortedData = data.graphDataList.sort(
          (a: RecordsData, b: RecordsData) =>
            new Date(b.graph_date!).getTime() -
            new Date(a.graph_date!).getTime()
        );
        return {
          value: String(sortedData[0].graph_data),
          date: sortedData[0].graph_date,
        };
      }
      return {};
    } catch (error) {
      console.error(
        `Error fetching latest data for recordId: ${recordId}`,
        error
      );
      return {};
    }
  };

  // 카드의 최신 데이터 업데이트
  const updateCardsWithLatestData = useCallback(async () => {
    if (!currentPet) return;
    if (loading) return;
    setLoading(true);

    try {
      await Promise.all(
        currentPet.records?.map(async (card) => {
          const latestData = await fetchLatestData(
            card.recordId,
            card.recordType
          );
          return {
            ...card,
            value: latestData.value || card.value,
            date: latestData.date || card.date,
          };
        }) ?? []
      );
    } catch (error) {
      console.error('Error updating cards:', error);
    } finally {
      setLoading(false);
      setIsDataFetched(true);
    }
  }, [currentPet, loading]);

  useEffect(() => {
    setIsDataFetched(false);
  }, [petId]);

  useEffect(() => {
    if (!isDataFetched && currentPet?.records?.length && !loading) {
      updateCardsWithLatestData();
    }
  }, [isDataFetched, currentPet, loading, updateCardsWithLatestData]);

  // 카드 삭제
  const handleRemoveCard = async (recordId: number) => {
    if (!currentPet) return;
    try {
      await removeRecord(String(currentPet.petId), recordId);
      Alert.alert('성공', '카테고리가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error);
      Alert.alert('오류', '카테고리 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 편집 모드 토글
  const toggleEditMode = () => setIsEditing(!isEditing);

  // 현재 펫의 records
  const cards = currentPet?.records || [];

  return (
    <View className='flex-1 items-center justify-center p-4'>
      {/* 편집 버튼 */}
      <View className='w-full flex-row justify-end'>
        <TouchableOpacity
          onPress={toggleEditMode}
          className='my-3 px-4 py-2 bg-blue-500 rounded-lg'>
          <Text className='text-white'>{isEditing ? '완료' : '편집'}</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 리스트 */}
      <FlatList
        data={cards}
        keyExtractor={(index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View className='relative'>
            <Card
              title={item.title}
              value={item.value}
              unit={item.unit}
              date={item.date}
              categoryColor={item.categoryColor}
            />
            {isEditing && item.title !== '카테고리를 자유롭게 추가해보세요' && (
              <TouchableOpacity
                onPress={() => handleRemoveCard(item.recordId)}
                className='absolute top-[-5%] right-[-5%] px-3 bg-red-500 rounded-full'>
                <Text className='text-white'>x</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListFooterComponent={
          <Link href={'/(tabs)/diary/add-card'}>
            <TouchableOpacity className='border w-36 h-44 border-gray-200 bg-gray-100 bg-opacity-40 flex items-center justify-center rounded-lg mt-4'>
              <Text className='text-gray-500 text-center'>
                카테고리를 자유롭게 추가해보세요
              </Text>
              <Text className='text-2xl text-gray-400'>+</Text>
            </TouchableOpacity>
          </Link>
        }
      />
    </View>
  );
};

export default CardList;
