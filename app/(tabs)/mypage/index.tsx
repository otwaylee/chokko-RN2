import { getUserComments, getUserPosts } from '@/api/myPage';
import { signOut } from '@/api/user';
import { PostBox, PostTabs, UserProfile } from '@/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Post {
  id?: number;
  postId: number;
  title?: string;
  content?: string;
  comment?: string;
  category: string;
  createdAt: string;
}

const MyPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'포스트' | '댓글'>('포스트');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    await signOut();
    router.push('/login'); // 로그인 페이지로 이동
  };

  // ✅ activeTab이 변경될 때마다 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let fetchedData: Post[] = [];
      if (activeTab === '포스트') {
        fetchedData = await getUserPosts();
      } else if (activeTab === '댓글') {
        fetchedData = await getUserComments();
      }

      setPosts(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  return (
    <View className='flex-1 bg-white px-4 pt-14'>
      {/* 🔹 헤더 (마이페이지 & 로그아웃 버튼) */}
      <View className='flex-row justify-between items-center mb-4'>
        <Text className='text-2xl font-bold'>마이 페이지</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className='text-blue-500'>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 유저 프로필 */}
      <UserProfile />

      {/* 🔹 탭 (포스트/댓글) */}
      <View className='py-3'>
        <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      {/* 🔹 글 목록 */}
      <ScrollView className='pb-20'>
        {loading ? (
          <View className='flex-1 justify-center items-center h-60'>
            <ActivityIndicator size='large' color='#79b2d1' />
          </View>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostBox
              key={post.id ? post.id : post.postId}
              title={post.title ?? ''}
              content={post.content ? post.content : post.comment || ''}
              createdAt={post.createdAt}
              category={post.category ?? ''}
            />
          ))
        ) : (
          !loading && (
            <Text className='text-gray-500 text-center mt-4'>
              게시글이 없습니다.
            </Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default MyPage;
