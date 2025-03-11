import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SegmentedControlProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SegmentedControl = ({
  tabs,
  activeTab,
  setActiveTab,
}: SegmentedControlProps) => {
  return (
    <View className='flex flex-row bg-gray-200 rounded-xl p-1 w-full mb-2'>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          className={`flex-1 py-2 rounded-xl items-center justify-center 
            ${
              activeTab === tab
                ? 'bg-white shadow text-black font-medium'
                : 'text-gray-500'
            }`}
          onPress={() => setActiveTab(tab)}>
          <Text
            className={`text-base ${
              activeTab === tab ? 'font-bold' : 'font-normal'
            }`}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default SegmentedControl;
