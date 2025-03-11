import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface NormalButtonProps {
  label: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

const NormalButton = ({
  label,
  onClick,
  isDisabled = false,
}: NormalButtonProps) => {
  return (
    <TouchableOpacity
      onPress={!isDisabled ? onClick : undefined}
      activeOpacity={isDisabled ? 1 : 0.7}
      className={`min-w-[296px] w-full h-[45px] p-3 rounded-lg 
        text-white text-base font-semibold 
        ${isDisabled ? 'bg-gray-300 opacity-50' : 'bg-primary'}`}
      disabled={isDisabled}>
      <Text className='text-center'>{label}</Text>
    </TouchableOpacity>
  );
};

export default NormalButton;
