import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import RecordOverlay from './Record';
import * as SecureStore from 'expo-secure-store';
import Record from './Record';

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
  graphDataId?: number;
}

interface RecordBoxProps {
  recordType: 'GRAPH' | 'PHOTO'; // 레코드 타입
  recordId: number; // 레코드 ID
  unit: string; // 단위
  onDataChange: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-api.com';

const RecordBox: React.FC<RecordBoxProps> = ({
  recordType,
  recordId,
  unit,
}) => {
  const [records, setRecords] = useState<RecordsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordsData | null>(
    null
  ); // 클릭된 기록

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('No authentication token found.');

        let response;
        if (recordType === 'GRAPH') {
          response = await axios.get(`${BASE_URL}/records/graph/${recordId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const sortedData = response.data.graphDataList.sort(
            (a: RecordsData, b: RecordsData) => {
              if (a.graph_date && b.graph_date) {
                return (
                  new Date(b.graph_date).getTime() -
                  new Date(a.graph_date).getTime()
                );
              }
              return 0;
            }
          );
          setRecords(sortedData);
        } else if (recordType === 'PHOTO') {
          response = await axios.get(`${BASE_URL}/records/photo/${recordId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const sortedData = response.data.photoDataList.sort(
            (a: RecordsData, b: RecordsData) => {
              if (a.photo_date && b.photo_date) {
                return (
                  new Date(a.photo_date).getTime() -
                  new Date(b.photo_date).getTime()
                );
              }
              return 0;
            }
          );
          setRecords(sortedData);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [recordType, recordId]);

  const handleRecordClick = (record: RecordsData) => {
    setSelectedRecord(record); // 클릭된 기록 설정
  };

  const handleOverlayClose = () => {
    setSelectedRecord(null); // 오버레이 닫기
  };

  const updateRecord = (updateRecord: RecordsData) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.graphDataId === updateRecord.graphDataId ? updateRecord : record
      )
    );
  };

  const deleteRecord = (graphDataId: number) => {
    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.graphDataId !== graphDataId)
    );
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        elevation: 3,
      }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        히스토리
      </Text>

      {loading ? (
        <ActivityIndicator size='large' color='#79b2d1' />
      ) : (
        <ScrollView style={{ maxHeight: 350 }}>
          {records.length > 0 ? (
            records.map((record, index) => {
              // `difference` 계산
              const previousValue =
                index < records.length - 1
                  ? parseFloat(records[index + 1].graph_data)
                  : null;
              const currentValue = parseFloat(record.graph_data);
              const difference =
                previousValue !== null
                  ? (currentValue - previousValue).toFixed(2)
                  : null;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRecordClick(record)}>
                  <Record
                    value={recordType === 'GRAPH' ? record.graph_data : ''}
                    unit={recordType === 'GRAPH' ? unit : ''}
                    difference={
                      difference
                        ? difference.startsWith('-')
                          ? difference
                          : `+${difference}`
                        : ''
                    }
                    date={
                      recordType === 'GRAPH'
                        ? record.graph_date ?? ''
                        : record.photo_date ?? ''
                    }
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ color: 'gray', textAlign: 'center' }}>
              기록이 없습니다.
            </Text>
          )}
        </ScrollView>
      )}

      {/* 기록 상세보기 오버레이 */}
      <Modal visible={!!selectedRecord} transparent animationType='fade'>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: SCREEN_WIDTH - 40,
            }}>
            <RecordOverlay
              record={{
                title:
                  selectedRecord?.graph_date ||
                  selectedRecord?.photo_date ||
                  '기록',
                value: selectedRecord?.graph_data || '',
                date:
                  selectedRecord?.graph_date ||
                  selectedRecord?.photo_date ||
                  '',
                time:
                  selectedRecord?.graph_time ||
                  selectedRecord?.photo_time ||
                  '',
                recordId: recordId,
                graphDataId: selectedRecord?.graphDataId,
              }}
              onClose={handleOverlayClose}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RecordBox;
