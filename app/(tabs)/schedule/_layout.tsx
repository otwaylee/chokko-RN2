import { Stack } from 'expo-router';

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Show header for all screens
      }}>
      <Stack.Screen
        name='index'
        options={{
          title: '일정', // Title for the main screen
        }}
      />

      <Stack.Screen
        name='add-schedule'
        options={{
          title: '일정 추가',
        }}
      />
      <Stack.Screen
        name='add-evnet'
        options={{
          title: '할일 추가',
        }}
      />
    </Stack>
  );
}
