import { Stack } from 'expo-router';

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Show header for all screens
      }}>
      <Stack.Screen
        name='index'
        options={{
          title: '커뮤니티', // Title for the main screen
        }}
      />

      <Stack.Screen
        name='[postId]'
        options={{
          title: '게시글 상세',
          presentation: 'modal', // Optional: If you want a modal-style screen
        }}
      />
    </Stack>
  );
}
