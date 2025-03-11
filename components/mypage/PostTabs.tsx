import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PostTabsProps {
  activeTab: '포스트' | '댓글';
  setActiveTab: (tab: '포스트' | '댓글') => void;
}

const PostTabs = ({ activeTab, setActiveTab }: PostTabsProps) => {
  return (
    <View className='flex-row justify-evenly bg-gray-100 rounded-xl py-1'>
      <TouchableOpacity
        className={`px-14 py-1 rounded-xl ${
          activeTab === '포스트'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-gray-500'
        }`}
        onPress={() => setActiveTab('포스트')}>
        <Text
          className={`text-lg font-semibold ${
            activeTab === '포스트' ? 'text-white' : 'text-gray-500'
          }`}>
          포스트
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`px-14 py-1 rounded-xl ${
          activeTab === '댓글'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-gray-500'
        }`}
        onPress={() => setActiveTab('댓글')}>
        <Text
          className={`text-lg font-semibold ${
            activeTab === '댓글' ? 'text-white' : 'text-gray-500'
          }`}>
          댓글
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostTabs;
