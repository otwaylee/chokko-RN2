import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import * as SecureStore from 'expo-secure-store';

const UserProfile = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await SecureStore.getItemAsync('userInfo');
      const storedToken = await SecureStore.getItemAsync('token');

      if (!user && storedUser && storedToken) {
        setUser(JSON.parse(storedUser), storedToken);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user, setUser]);

  const handleEditProfileClick = () => {
    router.push('/(tabs)/mypage/edit-profile');
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#000' />
        <Text className='text-gray-500 mt-2'>Loading user information...</Text>
      </View>
    );
  }

  return (
    <View className='flex items-center px-4'>
      {/* 프로필 이미지 */}
      <View className='relative'>
        <Image
          source={{
            uri: user?.profileImageUrl || 'https://via.placeholder.com/150',
          }}
          className='w-24 h-24 rounded-full'
        />
      </View>

      {/* 유저 정보 */}
      <View className='mt-2 items-center'>
        <Text className='text-xl font-bold'>
          {user?.username || '유저 이름'}
        </Text>
        <Text className='text-gray-500'>{user?.email || '유저 이메일'}</Text>
      </View>

      {/* 프로필 수정 버튼 */}
      <TouchableOpacity
        className='w-[320px] flex-row items-center justify-center my-2 py-2 rounded-lg border border-gray-300'
        onPress={handleEditProfileClick}>
        <Text className='text-gray-700'>프로필 수정하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;
