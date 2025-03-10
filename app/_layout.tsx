import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import '@/styles/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
  });

  const { token, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      await checkAuth(); // ✅ 로그인 상태 확인
      if (loaded || error) {
        await SplashScreen.hideAsync(); // ✅ 폰트 로드 완료 후 스플래시 숨김
      }
    };

    initApp();
  }, [loaded, error]);

  useEffect(() => {
    if (!isLoading) {
      router.replace(token ? '/(tabs)/diary' : '/(auth)'); // ✅ 로그인 여부에 따라 리다이렉트
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
}
