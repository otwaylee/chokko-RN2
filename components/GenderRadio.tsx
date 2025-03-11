import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface GenderRadioProps {
  onChange?: (selectedGender: string) => void;
}

const GenderRadio = ({ onChange }: GenderRadioProps) => {
  const [selectedGender, setSelectedGender] = useState<string>('');

  const genders = [
    { label: '남성', value: 'M' },
    { label: '여성', value: 'F' },
  ];

  const handleGenderChange = (gender: { label: string; value: string }) => {
    setSelectedGender(gender.value);
    if (onChange) {
      onChange(gender.value);
    }
  };

  return (
    <View className='flex flex-row items-center justify-between w-[200px]'>
      {genders.map((gender) => (
        <Pressable
          key={gender.value}
          onPress={() => handleGenderChange(gender)}
          className={`flex flex-row items-center px-3 py-2 rounded-lg 
            ${selectedGender === gender.value ? 'bg-gray-200' : ''}`}>
          <View
            className={`w-5 h-5 rounded-full border-2 
              ${
                selectedGender === gender.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400'
              }`}
          />
          <Text className='ml-2 text-lg text-gray-700'>{gender.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default GenderRadio;
