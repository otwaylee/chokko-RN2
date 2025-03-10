import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import axios from 'axios';

interface CommunityData {
  id: number;
  title: string;
  category: string;
  content: string;
  tags?: string[];
}

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-api.com';

interface CommunityFormProps {
  mode?: 'create' | 'edit';
  communityData?: CommunityData;
}

const CommunityForm = ({
  mode = 'create',
  communityData,
}: CommunityFormProps) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [tags, setTags] = useState<string[]>(communityData?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && communityData) {
      setFormData({
        title: communityData.title,
        category: communityData.category,
        content: communityData.content,
      });
      setTags(communityData.tags || []);
    }
  }, [mode, communityData]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        '권한 필요',
        '이미지 선택을 위해 갤러리 접근 권한이 필요합니다.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', JSON.stringify(tags));

      if (imageUri) {
        const filename = imageUri.split('/').pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formDataToSend.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const response = await axios.post(
        `${BASE_URL}/community/posts`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('성공', '게시글이 저장되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      Alert.alert('오류', '게시글 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView className='flex-1 p-4 bg-white'>
      <Text className='text-2xl font-bold mb-4'>
        {mode === 'create' ? '커뮤니티 글 작성' : '커뮤니티 글 수정'}
      </Text>

      {/* 제목 입력 */}
      <Text className='text-lg font-semibold mb-1'>제목</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 mb-3'
        placeholder='제목을 입력하세요'
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
      />

      {/* 카테고리 입력 */}
      <Text className='text-lg font-semibold mb-1'>카테고리</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 mb-3'
        placeholder='카테고리를 입력하세요'
        value={formData.category}
        onChangeText={(value) => handleChange('category', value)}
      />

      {/* 내용 입력 */}
      <Text className='text-lg font-semibold mb-1'>내용</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 h-40 mb-3'
        placeholder='내용을 입력하세요'
        value={formData.content}
        onChangeText={(value) => handleChange('content', value)}
        multiline
      />

      {/* 이미지 업로드 */}
      <Text className='text-lg font-semibold mb-1'>이미지 추가</Text>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className='w-full h-40 rounded-lg mb-3'
        />
      )}
      <TouchableOpacity
        className='border border-gray-300 rounded-lg p-3 items-center mb-3'
        onPress={handleImagePick}>
        <Text className='text-gray-700'>이미지 선택</Text>
      </TouchableOpacity>

      {/* 해시태그 입력 */}
      <Text className='text-lg font-semibold mb-1'>해시태그</Text>
      <View className='flex-row items-center mb-3'>
        <TextInput
          className='border border-gray-300 rounded-lg p-3 flex-1 mr-2'
          placeholder='태그 입력 후 추가'
          value={newTag}
          onChangeText={setNewTag}
        />
        <TouchableOpacity
          className='bg-gray-300 rounded-lg px-4 py-3'
          onPress={handleTagAdd}>
          <Text className='text-black'>추가</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tags}
        horizontal
        renderItem={({ item, index }) => (
          <View className='flex-row items-center bg-gray-200 px-3 py-1 rounded-full mr-2'>
            <Text className='text-gray-800'>#{item}</Text>
            <TouchableOpacity onPress={() => handleTagRemove(index)}>
              <Text className='text-red-500 ml-2'>x</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        className='mb-3'
      />

      {/* 저장 버튼 */}
      <TouchableOpacity
        className='bg-black py-3 rounded-lg items-center'
        onPress={handleSubmit}>
        <Text className='text-white text-lg font-semibold'>
          {mode === 'create' ? '저장' : '수정'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CommunityForm;
