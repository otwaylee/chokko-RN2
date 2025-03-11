import { ScheduleOverlay } from '@/components';
import React from 'react';
import { View, Text, Image } from 'react-native';

export default function Schedule() {
  return (
    <View className='flex-1 items-center justify-between bg-white'>
      {/* 상단 캘린더 부분 */}
      <View className='relative w-full mt-5 items-center'>
        {/* "현재 준비 중입니다" 문구 */}
        <View className='absolute top-0 w-full items-center bg-white bg-opacity-80 py-2 rounded-md z-10'>
          <Text className='text-lg text-gray-600'>
            현재 준비 중입니다. 곧 만나보실 수 있습니다!
          </Text>
        </View>

        {/* 캘린더 이미지 */}
        {/* <Image
          source={require('@/assets/images/Calendar.png')}
          className='w-full max-w-lg h-64'
          resizeMode='contain'
        /> */}
      </View>

      {/* 하단 할 일/일정 부분 */}
      <View className='absolute bottom-[70px] w-full items-center'>
        <ScheduleOverlay />
      </View>
    </View>
  );
}
