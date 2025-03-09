import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';

// JWT 디코드 타입 정의
interface DecodedToken {
  sub: string; // JWT에서 사용자 이메일이 담긴 부분
}

// ✅ 로그인 API 호출 함수 (토큰 저장을 SecureStore로 변경)
export async function userSignIn(email: string, password: string) {
  try {
    const response = await apiClient.post('/users/login', { email, password });

    console.log('로그인 성공:', response.data);
    const token = response.data; // 서버에서 받은 JWT 토큰

    // ✅ 토큰 저장
    await SecureStore.setItemAsync('authToken', token);

    // JWT 토큰을 디코딩하여 사용자 이메일 추출
    const decodedToken: DecodedToken = jwtDecode(token);
    const userEmail = decodedToken.sub;

    return { token, userEmail };
  } catch (error) {
    console.error('로그인 오류:', error);
    Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    return null;
  }
}

// ✅ 사용자 정보 가져오기
export async function fetchUserInfo(email: string) {
  try {
    const response = await apiClient.get('/users/profile', {
      params: { email },
    });

    console.log('사용자 정보:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 불러오기 실패:', error);
    Alert.alert('오류', '사용자 정보를 불러오지 못했습니다.');
    return null;
  }
}

// ✅ 회원가입 API 호출 함수
export async function userSignUp(
  username: string,
  email: string,
  password: string,
  gender: string,
  date_of_birth: string
) {
  try {
    const response = await apiClient.post('/users/register', {
      username,
      email,
      password,
      gender,
      date_of_birth,
      created_at: new Date().toISOString(),
      is_active: true,
    });

    console.log('회원가입 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    Alert.alert('회원가입 실패', '회원가입을 진행할 수 없습니다.');
    return null;
  }
}

// ✅ 이메일 중복 체크 함수 (에러 처리 보완)
export async function checkEmailDuplicate(email: string) {
  try {
    const response = await apiClient.get('/users/check-email', {
      params: { email },
    });

    return response.data; // { isDuplicate: boolean }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error);
    Alert.alert('오류', '이메일 중복 확인에 실패했습니다.');
    throw new Error('이메일 중복 확인 실패');
  }
}

// ✅ 로그아웃 함수
export async function signOut() {
  try {
    await SecureStore.deleteItemAsync('authToken');
    console.log('로그아웃 성공!');
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
}
