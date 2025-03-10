import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  username: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  comment: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export default function CommunityDetail() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/community/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUsername(response.data.username || null);
      } catch (error) {
        console.error('🚨 Error fetching current user:', error);
      }
    };

    const fetchPostAndComments = async () => {
      if (!postId) return;
      try {
        const postResponse = await axios.get(`${BASE_URL}/community/${postId}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(
          `${BASE_URL}/community/${postId}/comments`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('🚨 Error fetching post or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchPostAndComments();
  }, [postId]);

  // ✅ 댓글 추가 핸들러
  const handleAddComment = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return;

      const response = await axios.post(
        `${BASE_URL}/community/${postId}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('🚨 Error adding comment:', error);
      Alert.alert('댓글 작성 실패', '다시 시도해주세요.');
    }
  };

  // ✅ 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return;

      await axios.delete(`${BASE_URL}/community/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('게시글 삭제 완료', '게시글이 삭제되었습니다.');
      router.push('/(tabs)/community');
    } catch (error) {
      console.error('🚨 Error deleting post:', error);
      Alert.alert('게시글 삭제 실패', '다시 시도해주세요.');
    }
  };

  // ✅ 댓글 수정 핸들러
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.comment);
  };

  const handleSaveEditedComment = async (commentId: number) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return;

      await axios.patch(
        `${BASE_URL}/community/${postId}/comments/${commentId}`,
        { content: editingCommentContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, comment: editingCommentContent }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('🚨 Error editing comment:', error);
      Alert.alert('댓글 수정 실패', '다시 시도해주세요.');
    }
  };

  // ✅ 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return;

      await axios.delete(
        `${BASE_URL}/community/${postId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error('🚨 Error deleting comment:', error);
      Alert.alert('댓글 삭제 실패', '다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#79b2d1' />
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 p-4'>
      {post ? (
        <View>
          <Text className='text-2xl font-bold mb-2'>{post.title}</Text>

          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              className='w-full h-60 rounded-lg mb-4'
            />
          )}

          <Text className='text-lg mb-4'>{post.content}</Text>

          <Text className='text-sm text-gray-500'>
            작성자: {post.username} | 작성일:{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>

          {post.tags?.length > 0 && (
            <View className='flex-row flex-wrap gap-2 mt-2'>
              {post.tags.map((tag, index) => (
                <Text key={index} className='text-blue-500'>
                  #{tag}
                </Text>
              ))}
            </View>
          )}

          {currentUsername === post.username && (
            <TouchableOpacity
              className='bg-red-500 p-3 rounded-lg mt-4'
              onPress={handleDeletePost}>
              <Text className='text-white text-center'>게시글 삭제</Text>
            </TouchableOpacity>
          )}

          <Text className='text-xl font-bold mt-6'>댓글</Text>
          {comments.map((comment) => (
            <View key={comment.id} className='p-3 border-b'>
              {editingCommentId === comment.id ? (
                <>
                  <TextInput
                    value={editingCommentContent}
                    onChangeText={setEditingCommentContent}
                    className='border p-2 rounded'
                  />
                  <Button
                    title='저장'
                    onPress={() => handleSaveEditedComment(comment.id)}
                  />
                </>
              ) : (
                <>
                  <Text>{comment.comment}</Text>
                  <Text className='text-sm text-gray-500'>
                    {comment.username} |{' '}
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                  {currentUsername === comment.username && (
                    <TouchableOpacity
                      onPress={() => handleEditComment(comment)}>
                      <Text className='text-blue-500'>수정</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text>게시글을 불러오는 중입니다...</Text>
      )}
    </ScrollView>
  );
}
