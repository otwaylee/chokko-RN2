import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name='index' options={{ title: '랜딩페이지' }} />
      <Stack.Screen name='login' options={{ title: '로그인 페이지' }} />
      <Stack.Screen name='sign-up' options={{ title: '회원가입 페이지' }} />
    </Stack>
  );
}
