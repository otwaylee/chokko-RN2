import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { userSignUp, checkEmailDuplicate } from '@/api/user';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [genderLabel, setGenderLabel] = useState<string | null>(null); // 화면에 표시되는 값
  const [genderValue, setGenderValue] = useState<string | null>(null);

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();

  // ✅ 이메일 중복 체크 버튼
  const handleEmailCheck = async () => {
    try {
      if (!email) {
        Alert.alert('오류', '이메일을 입력해주세요.');
        return;
      }

      const result = await checkEmailDuplicate(email);
      if (result.isDuplicate) {
        Alert.alert('오류', '이미 사용 중인 이메일입니다.');
        setIsEmailChecked(false);
      } else {
        Alert.alert('확인', '사용 가능한 이메일입니다.');
        setIsEmailChecked(true);
      }
    } catch (error) {
      console.error(error);
      setIsEmailChecked(false);
    }
  };

  // ✅ 회원가입 버튼 클릭 이벤트
  const handleSignUp = async () => {
    if (
      !email ||
      !password ||
      !passwordConfirm ||
      !username ||
      !year ||
      !month ||
      !day ||
      !genderValue
    ) {
      Alert.alert('오류', '모든 필드를 입력해 주세요.');
      return;
    }

    if (!isEmailChecked) {
      Alert.alert('오류', '이메일 중복 확인을 완료해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const formattedMonth = month.padStart(2, '0');
      const formattedDay = day.padStart(2, '0');
      const date_of_birth = `${year}-${formattedMonth}-${formattedDay}`;

      const data = await userSignUp(
        username,
        email,
        password,
        genderValue,
        date_of_birth
      );

      Alert.alert('성공', '회원가입 성공!');
      router.push('/(auth)/login');
    } catch (error) {
      Alert.alert('오류', '회원가입에 실패했습니다.');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className='flex-1 items-center justify-center px-6'>
          <View className='w-full flex gap-1 mb-5'>
            <Text className='text-xl font-bold'>안녕하세요!</Text>
            <Text className='text-lg text-gray-600'>
              이메일로 회원가입 해주세요.
            </Text>
          </View>

          {/* 이메일 입력 */}
          <View className='w-full my-3'>
            <Text className='text-lg mb-3'>이메일</Text>
            <TextInput
              className='border border-gray-300 p-3 rounded-md w-full'
              placeholder='이메일을 입력하세요'
              placeholderTextColor='gray'
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setIsEmailChecked(false);
              }}
            />
            <TouchableOpacity
              onPress={async () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  Alert.alert('오류', '유효한 이메일 주소를 입력해 주세요.');
                  return;
                }
                try {
                  const result = await checkEmailDuplicate(email);
                  if (result.isDuplicate) {
                    Alert.alert('오류', '이미 사용 중인 이메일입니다.');
                    setIsEmailChecked(false);
                  } else {
                    Alert.alert('확인', '사용 가능한 이메일입니다.');
                    setIsEmailChecked(true);
                  }
                } catch (error) {
                  Alert.alert('오류', '이메일 중복 확인에 실패했습니다.');
                  setIsEmailChecked(false);
                }
              }}
              className='bg-gray-100 p-3 mt-2 rounded-lg border border-gray-300'>
              <Text className='text-black text-center'>중복 확인</Text>
            </TouchableOpacity>
          </View>

          {/* 비밀번호 입력 */}
          <View className='w-full my-3'>
            <Text className='text-lg mb-3'>비밀번호</Text>
            <TextInput
              className='border border-gray-300 p-3 rounded-lg w-full'
              placeholder='비밀번호 입력'
              placeholderTextColor='gray'
              secureTextEntry
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordConfirm && value !== passwordConfirm) {
                  setPasswordError('비밀번호가 일치하지 않습니다.');
                } else {
                  setPasswordError(null);
                }
              }}
            />
            <TextInput
              className='border border-gray-300 p-3 rounded-lg w-full mt-2'
              placeholder='비밀번호 확인'
              placeholderTextColor='gray'
              secureTextEntry
              value={passwordConfirm}
              onChangeText={(value) => {
                setPasswordConfirm(value);
                if (password && value !== password) {
                  setPasswordError('비밀번호가 일치하지 않습니다.');
                } else {
                  setPasswordError(null);
                }
              }}
            />
            {passwordError && (
              <Text className='text-red-500'>{passwordError}</Text>
            )}
          </View>

          {/* 닉네임 입력 */}
          <View className='w-full my-3'>
            <Text className='text-lg mb-3'>닉네임</Text>
            <TextInput
              className='border border-gray-300 p-3 rounded-lg w-full'
              placeholder='닉네임 입력'
              placeholderTextColor='gray'
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* 성별 선택 */}
          <View className='w-full my-3'>
            <Text className='text-lg mb-3'>성별</Text>
            <View className='flex-row justify-between mt-2'>
              <TouchableOpacity
                onPress={() => {
                  setGenderLabel('남성'); // UI에는 "남성" 표시
                  setGenderValue('M'); // 서버에는 "M" 보내기
                }}
                className={`p-3 flex items-center ${
                  genderLabel === '남성'
                    ? 'bg-gray-300'
                    : 'bg-gray-100 border border-gray-300'
                } rounded-lg w-48`}>
                <Text
                  className={`${
                    genderLabel === '남성' ? 'text-white' : 'text-black'
                  }`}>
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setGenderLabel('여성'); // UI에는 "남성" 표시
                  setGenderValue('F'); // 서버에는 "M" 보내기
                }}
                className={`p-3 flex items-center ${
                  genderLabel === '여성'
                    ? 'bg-gray-300'
                    : 'bg-gray-100 border border-gray-300'
                } rounded-lg w-48`}>
                <Text
                  className={`${
                    genderLabel === '여성' ? 'text-white' : 'text-black'
                  }`}>
                  여성
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 생년월일 선택 */}
          <View className='w-full my-3'>
            <Text className='text-lg mb-3'>생년월일</Text>
            <View className='flex-row justify-between'>
              <TextInput
                className='border border-gray-300 p-3 rounded-lg w-32  text-center'
                placeholder='년(YYYY)'
                placeholderTextColor='gray'
                value={year}
                onChangeText={setYear}
                keyboardType='number-pad'
              />
              <TextInput
                className='border border-gray-300 p-3 rounded-lg w-32 text-center'
                placeholder='월(MM)'
                placeholderTextColor='gray'
                value={month}
                onChangeText={setMonth}
                keyboardType='number-pad'
              />
              <TextInput
                className='border border-gray-300 p-3 rounded-lg w-32 text-center'
                placeholder='일(DD)'
                placeholderTextColor='gray'
                value={day}
                onChangeText={setDay}
                keyboardType='numeric'
              />
            </View>
          </View>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            onPress={async () => {
              if (
                !email ||
                !password ||
                !passwordConfirm ||
                !username ||
                !year ||
                !month ||
                !day ||
                !genderValue
              ) {
                Alert.alert('오류', '모든 필드를 입력해 주세요.');
                return;
              }

              if (!isEmailChecked) {
                Alert.alert('오류', '이메일 중복 확인을 완료해 주세요.');
                return;
              }

              if (password !== passwordConfirm) {
                Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
                return;
              }

              try {
                const formattedMonth = month.padStart(2, '0');
                const formattedDay = day.padStart(2, '0');
                const date_of_birth = `${year}-${formattedMonth}-${formattedDay}`;

                await userSignUp(
                  username,
                  email,
                  password,
                  genderValue,
                  date_of_birth
                );
                Alert.alert('성공', '회원가입 성공!');
                router.push('/login');
              } catch (error) {
                Alert.alert('오류', '회원가입에 실패했습니다.');
              }
            }}
            className='bg-primary p-3 rounded-lg w-full mt-5'>
            <Text className='text-white text-center text-lg'>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
