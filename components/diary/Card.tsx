import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

interface CardProps {
  title: string;
  unit?: string;
  date?: string;
  value?: string;
  categoryColor?: string;
  emoticon?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  unit = '',
  date = '',
  value = '',
  categoryColor = '#F3F4F6', // 기본 배경색 (gray-100)
  emoticon = '',
}) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: '/[title]',
        params: { title: title },
      }}
      asChild>
      <TouchableOpacity
        className={`border-[0.5px] ${categoryColor} border-gray-200 rounded-2xl p-4 w-36 h-44 flex justify-between`}>
        <View className='flex-row items-center'>
          <Text className='text-black text-lg font-bold'>{title}</Text>
          {emoticon && <Text className='text-lg ml-2'>{emoticon}</Text>}
        </View>
        <Text className='text-gray-400 text-base'>{date}</Text>
        <View className='flex justify-end mt-5'>
          <Text className='text-gray-500 text-lg'>
            {value}
            {unit}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default Card;
