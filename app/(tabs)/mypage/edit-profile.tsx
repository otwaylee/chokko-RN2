import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import apiClient from '@/api/apiClient';
import { Picker } from '@react-native-picker/picker';

const EditProfile: React.FC = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState({
    username: user?.username || '',
    date_of_birth: user?.date_of_birth || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    phone_country: user?.phone_country || '+82',
    gender: user?.gender || '',
    profileImageUrl: user?.profileImageUrl || '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await SecureStore.getItemAsync('userInfo');
      if (storedUser) {
        setProfile(JSON.parse(storedUser));
      }
    };
    loadUserData();
  }, []);

  // 🔹 프로필 이미지 선택 및 업로드
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 🔹 수정: 올바른 값으로 변경
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);

        const token = await SecureStore.getItemAsync('authToken');
        if (!token) {
          Alert.alert('오류', '로그인이 필요합니다.');
          return;
        }

        const formData = new FormData();
        formData.append('file', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any); // 🔹 수정: `Blob` 타입 대신 `any` 사용

        const response = await apiClient.patch(
          '/users/profile/image',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setProfile((prev) => ({
          ...prev,
          profileImageUrl: response.data,
        }));

        Alert.alert('성공', '프로필 사진이 변경되었습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '프로필 사진을 업로드하는 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 🔹 프로필 정보 저장
  const handleSaveProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      await apiClient.patch('/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(profile, token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(profile));

      Alert.alert('성공', '프로필 정보가 저장되었습니다.');
      router.push('/(tabs)/mypage');
    } catch (error) {
      Alert.alert('오류', '프로필 업데이트에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <View className='flex-1 p-6 bg-white'>
      {/* 🔹 헤더 */}
      <TouchableOpacity onPress={() => router.back()} className='mb-4'>
        <Text className='text-lg text-blue-500'>{'< 뒤로가기'}</Text>
      </TouchableOpacity>

      <Text className='text-xl font-bold mb-4'>프로필 수정하기</Text>

      {/* 🔹 프로필 사진 */}
      <View className='items-center mb-4'>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profile.profileImageUrl
                ? { uri: profile.profileImageUrl }
                : require('@/assets/images/defaultProfile.png')
            }
            className='w-24 h-24 rounded-full'
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 입력 필드 */}
      <View className='space-y-4'>
        <TextInput
          className='border border-gray-300 p-3 rounded-md'
          placeholder='닉네임'
          value={profile.username}
          onChangeText={(value) =>
            setProfile((prev) => ({ ...prev, username: value }))
          }
        />

        <TextInput
          className='border border-gray-300 p-3 rounded-md'
          placeholder='생년월일 (YYYY-MM-DD)'
          value={profile.date_of_birth}
          onChangeText={(value) =>
            setProfile((prev) => ({ ...prev, date_of_birth: value }))
          }
        />

        <TextInput
          className='border border-gray-300 p-3 rounded-md'
          placeholder='이메일'
          keyboardType='email-address'
          value={profile.email}
          onChangeText={(value) =>
            setProfile((prev) => ({ ...prev, email: value }))
          }
        />

        <View className='flex-row items-center border border-gray-300 rounded-md'>
          <TextInput
            className='w-16 p-3 border-r border-gray-300 text-center'
            placeholder='+82'
            value={profile.phone_country}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, phone_country: value }))
            }
          />
          <TextInput
            className='flex-1 p-3'
            placeholder='전화번호'
            keyboardType='phone-pad'
            value={profile.phone_number}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, phone_number: value }))
            }
          />
        </View>

        {/* 🔹 성별 선택 */}
        <View className='border border-gray-300 rounded-md'>
          <Picker
            selectedValue={profile.gender}
            onValueChange={(value) =>
              setProfile((prev) => ({ ...prev, gender: value }))
            }>
            <Picker.Item label='성별' value='' />
            <Picker.Item label='남성' value='M' />
            <Picker.Item label='여성' value='F' />
          </Picker>
        </View>
      </View>

      {/* 🔹 저장 버튼 */}
      <TouchableOpacity
        onPress={handleSaveProfile}
        className='bg-blue-500 p-3 rounded-lg mt-6'>
        <Text className='text-white text-center'>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;
