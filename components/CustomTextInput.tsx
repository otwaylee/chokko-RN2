import { memo } from 'react';
import { TextInput, View } from 'react-native';

interface CustomTextInputProps {
  inputType: 'email' | 'text' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const CustomTextInput = ({
  inputType,
  placeholder,
  onChange,
  value,
}: CustomTextInputProps) => {
  return (
    <View className='border border-gray-200 rounded-lg min-w-[295px] w-full h-[38px] px-3'>
      <TextInput
        className='text-base w-full h-full'
        secureTextEntry={inputType === 'password'}
        keyboardType={
          inputType === 'email'
            ? 'email-address'
            : inputType === 'tel'
            ? 'phone-pad'
            : 'default'
        }
        placeholder={placeholder}
        value={value}
        onChangeText={onChange} // 함수 바로 전달
      />
    </View>
  );
};

export default memo(CustomTextInput);
