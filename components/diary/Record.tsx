import React from 'react';
import { View, Text, Image } from 'react-native';

interface RecordProps {
  value: string;
  unit?: string; // 그래프일 경우
  difference?: string; // 증감 값 (그래프일 경우)
  date: string; // 기록 날짜
  photoUrl?: string; // 사진일 경우
  description?: string; // 사진 설명
}

const Record: React.FC<RecordProps> = ({
  value,
  unit,
  difference,
  date,
  photoUrl,
  description,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
      {/* 📸 사진이 있는 경우 (PHOTO RECORD) */}
      {photoUrl ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: photoUrl }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 14, color: '#666' }}>{description}</Text>
        </View>
      ) : (
        /* 📊 그래프 데이터인 경우 (GRAPH RECORD) */
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {value} {unit}
          </Text>

          {difference && parseFloat(difference) !== 0 && (
            <View
              style={{
                backgroundColor: '#f1f1f1',
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: difference.startsWith('+') ? 'red' : 'blue',
                }}>
                {difference}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 📅 날짜 표시 */}
      <Text style={{ color: '#888' }}>{date}</Text>
    </View>
  );
};

export default Record;
