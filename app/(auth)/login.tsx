import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { userSignIn } from '@/api/user'; // 로그인 API 호출 함수

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const result = await userSignIn(email, password);

      if (result) {
        Alert.alert('로그인 성공', '환영합니다!');
        router.replace('/(tabs)/diary'); // 로그인 후 메인 화면으로 이동
      }
    } catch (error) {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className='flex-1 mb-20 items-center justify-center px-6'>
      <View className='w-full mb-10 gap-2'>
        <Text className='text-lg'>환영합니다 😃</Text>
        <Text className='text-lg'>가입된 이메일로 로그인 해주세요!</Text>
      </View>

      <View className='w-full gap-6'>
        <View>
          <Text className='text-lg text-black'>이메일</Text>
          <TextInput
            className='w-full h-12 border border-gray-400 rounded-md p-3 mt-4 text-base'
            placeholder='이메일'
            placeholderTextColor='gray'
            value={email}
            onChangeText={setEmail} // 입력값 상태 업데이트
            autoCapitalize='none'
            keyboardType='email-address'
          />
        </View>
        <View>
          <Text className='text-lg text-black'>비밀번호</Text>
          <TextInput
            className='border border-gray-400 rounded-md p-3 h-12 mt-4 w-full text-base'
            placeholder='비밀번호'
            placeholderTextColor='gray'
            secureTextEntry
            value={password}
            onChangeText={setPassword} // 입력값 상태 업데이트
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-full flex items-center p-4 rounded-lg mt-6 ${
          loading ? 'bg-gray-400' : 'bg-blue-500'
        }`}
        onPress={handleLogin}
        disabled={loading}>
        <Text className='text-white'>
          {loading ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>

      <View className='flex-row gap-2 items-center mt-5'>
        <Text className='text-gray-300'>회원이 아니신가요?</Text>
        <Link href='/sign-up' asChild>
          <TouchableOpacity>
            <Text className='text-primary'>회원가입</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
