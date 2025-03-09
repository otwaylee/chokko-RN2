import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  async function handleLogin() {
    await SecureStore.setItemAsync('authToken', 'dummy-token'); //
    router.replace('/'); //리디렉션
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
            className='w-full h-12 border border-gray-400 rounded-md p-3 mt-4  text-base '
            placeholder='이메일'
            placeholderTextColor='gray'
          />
        </View>
        <View>
          <Text className='text-lg text-black'>비밀번호</Text>
          <TextInput
            className='border border-gray-400 rounded-md p-3 h-12 mt-4 w-full text-base'
            placeholder='비밀번호'
            placeholderTextColor='gray'
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        className='bg-blue-500 w-full flex items-center p-4 rounded-lg mt-6'
        onPress={handleLogin}>
        <Text className='text-white'>로그인</Text>
      </TouchableOpacity>
      <View className=' flex-row gap-2 items-center mt-5'>
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
