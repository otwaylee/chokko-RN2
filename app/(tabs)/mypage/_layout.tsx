import { Stack } from 'expo-router';

export default function MyPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Show header for all screens
      }}>
      <Stack.Screen
        name='index'
        options={{
          title: '마이페이지', // Title for the main screen
        }}
      />

      <Stack.Screen
        name='edit-profile'
        options={{
          title: '프로필 편집',
        }}
      />
    </Stack>
  );
}
