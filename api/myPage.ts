import * as SecureStore from 'expo-secure-store';
import apiClient from './apiClient';

const userInfo = SecureStore.getItemAsync('userInfo');

const token = SecureStore.getItemAsync('authToken');

// 유저 포스트 가져오기
export async function getUserPosts() {
  if (!userInfo) {
    throw new Error('로그인된 유저 정보를 찾을 수 없습니다.');
  }

  // 유저 토큰을 헤더에 포함하여 API 호출
  const response = await apiClient.get('/users/posts', {
    headers: {
      Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
    },
  });

  return response.data; // 서버에서 받은 나의 포스트 데이터
}

// 유저 댓글 가져오기
export async function getUserComments() {
  if (!userInfo) {
    throw new Error('로그인된 유저 정보를 찾을 수 없습니다.');
  }

  const response = await apiClient.get('/users/comments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
