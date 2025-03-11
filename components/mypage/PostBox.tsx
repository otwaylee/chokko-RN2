import React from 'react';
import { View, Text } from 'react-native';

interface PostBoxProps {
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const PostBox = ({ title, content, category, createdAt }: PostBoxProps) => {
  return (
    <View className='border rounded-lg p-4 mb-4 shadow-md bg-white'>
      {/* 제목 */}
      <Text className='text-lg font-semibold'>{title}</Text>

      {/* 내용 미리보기 */}
      <Text className='text-gray-600 mb-2'>{content}</Text>

      {/* 작성일과 카테고리 */}
      <Text className='text-sm text-gray-500'>
        {new Date(createdAt).toISOString().split('T')[0]}﹒{category}
      </Text>
    </View>
  );
};

export default PostBox;
