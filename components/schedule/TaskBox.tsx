import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';

interface TaskBoxProps {
  taskName: string;
  time: string; // 24시간 형식의 시간
  isCompleted?: boolean;
  onToggle?: () => void;
}

export default function TaskBox({
  taskName,
  time,
  isCompleted = false,
  onToggle,
}: TaskBoxProps) {
  // 시간을 12시간 형식으로 변환하는 함수
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      className={`flex-row justify-between items-center p-4 rounded-lg shadow-md ${
        isCompleted ? 'bg-[#E0F3F4]' : 'bg-[#FFEECC]'
      }`}>
      {/* 왼쪽: 체크박스 & 할 일 텍스트 */}
      <View className='flex-row items-center'>
        <Switch value={isCompleted} onValueChange={onToggle} />
        <Text
          className={`ml-3 font-medium ${
            isCompleted ? 'line-through text-gray-400' : 'text-black'
          }`}>
          {taskName}
        </Text>
      </View>

      {/* 오른쪽: 시간 표시 */}
      <Text className='text-gray-500'>{formatTime(time)}</Text>
    </TouchableOpacity>
  );
}
