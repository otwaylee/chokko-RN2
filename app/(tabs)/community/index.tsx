import React from 'react';
import { View } from 'react-native';
import PostList from '@/components/community/PostList'; // 포스트 리스트 컴포넌트

export default function Community() {
  return (
    <View className='px-4 pt-4'>
      <PostList />
    </View>
  );
}
