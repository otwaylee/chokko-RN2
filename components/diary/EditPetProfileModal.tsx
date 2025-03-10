import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface Pet {
  pet_name: string;
  species: string;
  pet_registration_number: string;
  date_of_birth: string;
  gender: string;
  breed: string;
  neutering: string;
  imageUrl?: string;
}

interface EditPetProfileModalProps {
  petInfo: Pet;
  onSave: (updatedPet: Pet) => Promise<void>;
  onClose: () => void;
  onDelete: (petId: number) => void;
}

const defaultImageUrl = 'https://via.placeholder.com/150';

const EditPetProfileModal: React.FC<EditPetProfileModalProps> = ({
  petInfo,
  onSave,
  onClose,
  onDelete,
}) => {
  const [petData, setPetData] = useState<Pet>({
    ...petInfo,
    imageUrl: petInfo.imageUrl || defaultImageUrl,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name: keyof Pet, value: string) => {
    setPetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(petData);
      onClose();
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      Alert.alert('저장에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    if (!petInfo.pet_name) {
      Alert.alert('삭제할 수 없는 반려동물입니다.');
      return;
    }

    Alert.alert('확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', onPress: () => onDelete(petInfo.pet_name) },
    ]);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPetData((prev) => ({
        ...prev,
        imageUrl: result.assets[0].uri,
      }));
    }
  };

  return (
    <Modal visible={true} animationType='slide' transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>반려동물 정보 수정</Text>

            {/* 이름 입력 */}
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              value={petData.pet_name}
              onChangeText={(text) => handleInputChange('pet_name', text)}
            />

            {/* 종 입력 */}
            <Text style={styles.label}>종</Text>
            <TextInput
              style={styles.input}
              value={petData.species}
              onChangeText={(text) => handleInputChange('species', text)}
            />

            {/* 등록번호 입력 */}
            <Text style={styles.label}>등록번호</Text>
            <TextInput
              style={styles.input}
              value={petData.pet_registration_number}
              onChangeText={(text) =>
                handleInputChange('pet_registration_number', text)
              }
            />

            {/* 생년월일 입력 */}
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}>
              <Text>{petData.date_of_birth || '날짜 선택'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  petData.date_of_birth
                    ? new Date(petData.date_of_birth)
                    : new Date()
                }
                mode='date'
                display='spinner'
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    handleInputChange(
                      'date_of_birth',
                      date.toISOString().split('T')[0]
                    );
                  }
                }}
              />
            )}

            {/* 성별 선택 */}
            <Text style={styles.label}>성별</Text>
            <Picker
              selectedValue={petData.gender}
              onValueChange={(itemValue) =>
                handleInputChange('gender', itemValue)
              }
              style={styles.input}>
              <Picker.Item label='수컷' value='M' />
              <Picker.Item label='암컷' value='F' />
              <Picker.Item label='모름' value='N' />
            </Picker>

            {/* 품종 입력 */}
            <Text style={styles.label}>품종</Text>
            <TextInput
              style={styles.input}
              value={petData.breed}
              onChangeText={(text) => handleInputChange('breed', text)}
            />

            {/* 중성화 여부 선택 */}
            <Text style={styles.label}>중성화 여부</Text>
            <Picker
              selectedValue={petData.neutering}
              onValueChange={(itemValue) =>
                handleInputChange('neutering', itemValue)
              }
              style={styles.input}>
              <Picker.Item label='예' value='Y' />
              <Picker.Item label='아니오' value='N' />
            </Picker>

            {/* 프로필 이미지 업로드 */}
            <Text style={styles.label}>프로필 이미지</Text>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.imagePicker}>
              <Text>이미지 선택</Text>
            </TouchableOpacity>
            {petData.imageUrl && (
              <Image
                source={{ uri: petData.imageUrl }}
                style={styles.imagePreview}
              />
            )}

            {/* 버튼 섹션 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>저장</Text>
              </TouchableOpacity>
            </View>

            {/* 삭제 버튼 */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}>
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
};

export default EditPetProfileModal;
