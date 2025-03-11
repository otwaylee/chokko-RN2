import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodoStore } from '@/stores/useTodoStore';
import { useEventStore } from '@/stores/useEventStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import TaskBox from './TaskBox';

export default function ScheduleOverlay() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'할일' | '일정'>('할일');
  const { todos, completeTodo } = useTodoStore();
  const { events } = useEventStore();

  const minHeight = 150;
  const maxHeight = 600;
  const animatedHeight = useSharedValue(250);

  // 🔹 드래그 핸들 기능 구현 (Gesture API 사용)
  const drag = Gesture.Pan()
    .onChange((event) => {
      animatedHeight.value = Math.max(
        minHeight,
        Math.min(maxHeight, animatedHeight.value - event.changeY)
      );
    })
    .onEnd(() => {
      animatedHeight.value = withSpring(animatedHeight.value);
    });

  // 🔹 애니메이션 적용
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View
        className='absolute bottom-0 w-full bg-white rounded-t-2xl shadow-lg'
        style={animatedStyle}>
        {/* 드래그 핸들 */}
        <View className='items-center py-2'>
          <View className='w-12 h-1 bg-gray-300 rounded-full' />
        </View>

        {/* 탭 버튼 */}
        <View className='flex-row justify-between border-b border-gray-300 pb-2 px-4'>
          <View className='flex-row'>
            <TouchableOpacity
              className={`px-4 py-2 ${
                activeTab === '할일'
                  ? 'font-medium text-blue-600 border-b-2 border-blue-600'
                  : 'text-black'
              }`}
              onPress={() => setActiveTab('할일')}>
              <Text>할 일</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 ${
                activeTab === '일정'
                  ? 'font-medium text-blue-600 border-b-2 border-blue-600'
                  : 'text-black'
              }`}
              onPress={() => setActiveTab('일정')}>
              <Text>일정</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/schedule/add-schedule')}>
            <Text className='text-gray-500 text-lg'>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* 리스트 영역 */}
        <ScrollView className='mt-4 px-4'>
          {activeTab === '할일'
            ? todos.map((todo, index) => (
                <TaskBox
                  key={index}
                  taskName={todo.title}
                  time={todo.startDatetime}
                  isCompleted={todo.completed}
                  onToggle={() =>
                    completeTodo(todo.todolist_id, !todo.completed)
                  }
                />
              ))
            : events.map((event, index) => (
                <TaskBox
                  key={index}
                  taskName={event.title}
                  time={new Date(event.startDatetime).toLocaleTimeString()}
                />
              ))}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
