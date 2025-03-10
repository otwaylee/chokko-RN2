import { Stack } from 'expo-router';

export default function DiaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Show header for all screens
      }}>
      <Stack.Screen
        name='index'
        options={{
          title: '기록', // Title for the main screen
        }}
      />

      <Stack.Screen
        name='[title]'
        options={{
          title: '카드 상세',
        }}
      />
      <Stack.Screen
        name='add-card'
        options={{
          title: '카드 상세',
        }}
      />
    </Stack>
  );
}
