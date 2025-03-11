import { TouchableOpacity, Text } from 'react-native';

interface CheckButtonProps {
  label: string;
  onClick?: () => void;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  fontSize?: number;
  borderRadius?: number;
  height?: number;
  id?: string;
}

const CheckButton = ({
  label,
  onClick,
  textColor = 'text-black',
  bgColor = 'bg-white',
  borderColor = 'border-gray-300',
  fontSize = 16,
  borderRadius = 8,
  height = 38,
  id = 'CheckButton',
}: CheckButtonProps) => {
  return (
    <TouchableOpacity
      className={`border min-w-[295px] w-full flex items-center justify-center active:opacity-70 ${bgColor} ${borderColor} rounded-[${borderRadius}px] h-[${height}px]`}
      onPress={onClick}
      accessibilityLabel={id}
      activeOpacity={0.7}>
      <Text className={`font-bold ${textColor} text-[${fontSize}px]`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckButton;
