import { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DateButtonProps {
  label: string;
  onChange: (value: string) => void;
}

const DateButton = ({ label, onChange }: DateButtonProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  // 연도, 월, 일 데이터 생성
  const generateOptions = () => {
    switch (label) {
      case '년':
        return Array.from({ length: 2024 - 1920 + 1 }, (_, i) =>
          (2024 - i).toString()
        );
      case '월':
        return Array.from({ length: 12 }, (_, i) => (i + 1).toString());
      case '일':
        return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
      default:
        return [];
    }
  };

  return (
    <View className='border border-gray-300 rounded-lg min-w-[95px] h-[38px] justify-center'>
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleSelect}
        className='text-center'>
        <Picker.Item label={label} value='' />
        {generateOptions().map((option) => (
          <Picker.Item
            key={option}
            label={`${option} ${label}`}
            value={option}
          />
        ))}
      </Picker>
    </View>
  );
};

export default DateButton;
