import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Landing() {
  const router = useRouter();

  return (
    <View className='flex-1'>
      <View className=' flex-1 items-center justify-center pt-50'>
        <Image
          className='w-20 h-20 mb-10'
          source={require('@/assets/images/logo.png')}
        />
        <Text className='text-3xl font-extrabold mb-10'>촉촉한 코</Text>
        <Text className='font-semibold text-gray-500 mb-2 text-lg'>
          내 손 안의 반려동물 수첩
        </Text>
        <Text className='text-base text-gray-300'>
          매일매일 기록하는 반려동물 상태!
        </Text>
        <View className='w-screen px-4 mt-20'>
          <Link href='/sign-up' asChild>
            <TouchableOpacity className='bg-primary rounded-lg py-3 items-center'>
              <Text className='text-white text-base'>시작하기</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View className='flex-row gap-2 items-center mt-5'>
          <Text className='text-gray-300'>이미 계정이 있나요?</Text>
          <Link href='/login' asChild>
            <TouchableOpacity>
              <Text className='text-primary'>로그인</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
