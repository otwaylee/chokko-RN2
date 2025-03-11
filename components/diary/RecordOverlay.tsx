import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';

interface selectedRecordData {
  title: string;
  value: string | number;
  date: string;
  time: string;
  details?: string; // 추가 상세 정보
  recordId?: number; // record ID
  graphDataId?: number; // graph data ID
}

interface RecordsData {
  graph_data: string;
  unit?: string;
  graph_date?: string;
  graph_time?: string;
  photo_time?: string;
  recordId?: number;
  photo_date?: string;
  photoUrl?: string;
  description?: string;
  graphDataId: number;
}

interface RecordOverlayProps {
  record: selectedRecordData;
  visible: boolean;
  onClose: () => void;
  onUpdate: (updateRecord: RecordsData) => void;
  onDelete: (graphDataId: number) => void;
}

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const RecordOverlay: React.FC<RecordOverlayProps> = ({
  record,

  onClose,
  onUpdate,
  onDelete,
}) => {
  const [value, setValue] = useState<string>(record.value.toString());
  const [time, setTime] = useState<string>(record.time);

  const handleUpdate = async () => {
    const token = ''; // AsyncStorage에서 가져오거나 전역 상태에서 사용
    const updateRecord = {
      graph_data: +value,
      graph_time: time || null,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/records/graph/${record.recordId}/${record.graphDataId}`,
        updateRecord,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('성공', '데이터가 성공적으로 수정되었습니다.');

      onUpdate({
        ...record,
        graph_date: response.data.graph_date,
        recordId: response.data.recordId,
        graphDataId: response.data.graphDataId,
        graph_data: response.data.graph_data,
        graph_time: response.data.graph_time,
      });

      onClose();
    } catch (error) {
      console.error('데이터 수정 오류:', error);
      Alert.alert('오류', '데이터 수정 중 문제가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    const token = ''; // AsyncStorage에서 가져오거나 전역 상태에서 사용
    Alert.alert('삭제 확인', '정말로 데이터를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: async () => {
          try {
            await axios.delete(
              `${BASE_URL}/records/graph/${record.recordId}/data/${record.graphDataId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert('성공', '데이터가 성공적으로 삭제되었습니다.');
            onDelete(record.graphDataId!);
            onClose();
          } catch (error) {
            console.error('데이터 삭제 오류:', error);
            Alert.alert('오류', '데이터 삭제 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <Modal
      animationType='slide'
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          {/* 헤더 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
              paddingBottom: 10,
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {record.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 18, color: 'gray' }}>✖️</Text>
            </TouchableOpacity>
          </View>

          {/* 입력 필드 */}
          <View style={{ marginTop: 15 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
                fontSize: 16,
                color: '#333',
              }}
              placeholder='데이터 입력'
              keyboardType='numeric'
              value={value}
              onChangeText={setValue}
            />
            <Text
              style={{
                textAlign: 'right',
                marginTop: 5,
                fontSize: 14,
                color: '#666',
              }}>
              {record.details} kg
            </Text>
          </View>

          {/* 시간 입력 */}
          <View style={{ marginTop: 15 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
                fontSize: 16,
                color: '#333',
              }}
              placeholder='시간 입력'
              value={time}
              onChangeText={setTime}
            />
          </View>

          {/* 버튼 영역 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            {/* 수정 버튼 */}
            <TouchableOpacity
              onPress={handleUpdate}
              style={{
                flex: 5,
                backgroundColor: '#007bff',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>입력</Text>
            </TouchableOpacity>

            {/* 삭제 버튼 */}
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                flex: 1,
                backgroundColor: '#eee',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Text style={{ color: 'red', fontSize: 16 }}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecordOverlay;
