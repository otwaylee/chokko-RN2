import apiClient from '@/api/apiClient';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Post {
  postId: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/community/posts');
        console.log('Posts response:', response.data);

        const sortedPosts = response.data.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <View className='flex-1 p-4 bg-white'>
      {loading ? (
        <ActivityIndicator size='large' color='#00BFFF' />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.postId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className='mb-4 p-4 bg-white rounded-lg shadow-md'
              onPress={() => router.push(`/(tabs)/community/${item.postId}`)}>
              <Text className='text-xl font-bold mb-2'>{item.title}</Text>
              <Text className='text-gray-600'>카테고리: {item.category}</Text>
              <Text className='text-gray-600'>
                작성일: {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              {/* 해시태그 표시 */}
              {item.tags && item.tags.length > 0 && (
                <View className='flex-row flex-wrap gap-2 mt-2'>
                  {item.tags.map((tag, index) => (
                    <View
                      key={index}
                      className='bg-teal-100 px-2 py-1 rounded-full'>
                      <Text className='text-teal-700 text-sm'>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className='text-center text-gray-500'>게시글이 없습니다.</Text>
      )}

      {/* 포스트 작성 버튼 */}
      <TouchableOpacity
        className='absolute bottom-10 right-4 bg-green-500 p-4 rounded-full shadow-lg'
        onPress={() => router.push('/community/create')}>
        <Text className='text-white text-lg font-bold'>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostList;
