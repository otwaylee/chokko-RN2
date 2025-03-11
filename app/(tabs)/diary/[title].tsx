import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import apiClient from '@/api/apiClient';
import CustomBarChart from '@/components/diary/BarChart';
import CustomLineChart from '@/components/diary/LineChart';

// ✅ API 응답 타입 지정
interface GraphData {
  graph_data: number;
  graph_date?: string;
  graph_time?: string;
  graphDataId?: number;
}

interface PhotoData {
  photo_url?: string;
  photoType_title?: string;
  photo_date?: string;
  content?: string;
  photoDataId?: number;
}

interface ApiResponse {
  graphDataList?: GraphData[];
  photoDataList?: PhotoData[];
}

export default function DiaryDetail() {
  const { title } = useLocalSearchParams(); // URL에서 title 가져오기
  const router = useRouter();

  const [recordType, setRecordType] = useState<'GRAPH' | 'PHOTO'>();
  const [recordId, setRecordId] = useState<number>();
  const [unit, setUnit] = useState<string>('');
  const [records, setRecords] = useState<GraphData[] | PhotoData[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'BAR' | 'LINE'>('BAR');

  useEffect(() => {
    const loadUserInfo = async () => {
      const storedUserInfo = await SecureStore.getItemAsync('userInfo');
      const selectedPetId = await SecureStore.getItemAsync('selectedPetId');

      if (!storedUserInfo || !selectedPetId) return;

      const parsedUserInfo = JSON.parse(storedUserInfo);
      const selectedPet = parsedUserInfo.pets?.find(
        (pet: { petId: number }) => String(pet.petId) === selectedPetId
      );

      if (selectedPet) {
        const record = selectedPet.records?.find(
          (r: { title: string }) => r.title === title
        );

        if (record) {
          setRecordType(record.recordType);
          setRecordId(record.recordId);
          setUnit(record.unit || '');
        }
      }
    };

    loadUserInfo();
  }, [title]);

  // ✅ API 호출
  const fetchHistoryData = useCallback(async () => {
    if (!recordType || !recordId) return;
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await apiClient.get<ApiResponse>(
        `/records/${recordType === 'GRAPH' ? 'graph' : 'photo'}/${recordId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (recordType === 'GRAPH' && response.data.graphDataList) {
        const sortedData = response.data.graphDataList.sort((a, b) =>
          a.graph_date && b.graph_date
            ? new Date(a.graph_date).getTime() -
              new Date(b.graph_date).getTime()
            : 0
        );

        setRecords(sortedData);
        setLabels(sortedData.map((data) => data.graph_date || ''));
      }

      if (recordType === 'PHOTO' && response.data.photoDataList) {
        const sortedData = response.data.photoDataList.sort((a, b) =>
          a.photo_date && b.photo_date
            ? new Date(a.photo_date).getTime() -
              new Date(b.photo_date).getTime()
            : 0
        );

        setRecords(sortedData);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setLoading(false);
    }
  }, [recordType, recordId]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#79b2d1' />
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 p-4'>
      <View className='flex-row justify-between'>
        <TouchableOpacity onPress={() => router.push('/diary')}>
          <Text className='text-lg text-blue-500'>{'< 뒤로가기'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/diary/${title}/add-record`)}>
          <Text className='text-lg text-blue-500'>{'+ 기록 추가'}</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-2xl font-bold text-center mt-4'>{title}</Text>

      {recordType === 'GRAPH' && (
        <>
          <View className='flex-row justify-center mt-4'>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                chartType === 'BAR' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onPress={() => setChartType('BAR')}>
              <Text>바 차트</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 ml-2 rounded-lg ${
                chartType === 'LINE' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onPress={() => setChartType('LINE')}>
              <Text>선 차트</Text>
            </TouchableOpacity>
          </View>

          <View className='mt-4'>
            {chartType === 'BAR' ? (
              <CustomBarChart
                unit={unit}
                labels={labels}
                dataValues={(records as GraphData[]).map(
                  (record) => record.graph_data
                )}
              />
            ) : (
              <CustomLineChart
                unit={unit}
                labels={labels}
                dataValues={(records as GraphData[]).map(
                  (record) => record.graph_data
                )}
              />
            )}
          </View>
        </>
      )}

      {recordType === 'PHOTO' && (
        <View className='mt-6'>
          {(records as PhotoData[]).map((record, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                router.push(`/diary/${title}/photo/${record.photoDataId}`)
              }
              className='border rounded-lg overflow-hidden shadow-sm mb-4'>
              {record.photo_url && (
                <Image
                  source={{ uri: record.photo_url }}
                  className='w-full h-48 object-cover'
                />
              )}
              <View className='p-2'>
                <Text className='text-lg font-semibold'>
                  {record.photoType_title}
                </Text>
                <Text className='text-gray-600'>{record.photo_date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
