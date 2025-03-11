import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
const LeftIcon = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      aria-label='이전 페이지로 이동'>
      <LeftArrow width={20} height={20} />
    </TouchableOpacity>
  );
};

export default memo(LeftIcon);
