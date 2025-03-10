import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

interface PetProfileListProps {
  profiles: { pet_name: string; imageUrl?: string }[];
  onAddProfile: () => void;
  onSelectProfile: (index: number) => void;
  selectedProfileIndex: number;
}

const PetProfileList: React.FC<PetProfileListProps> = ({
  profiles,
  onAddProfile,
  onSelectProfile,
  selectedProfileIndex,
}) => {
  const handleAddAndSelectProfile = () => {
    onAddProfile(); // 프로필 추가
    const newIndex = profiles.length; // 새 프로필 인덱스 계산
    onSelectProfile(newIndex); // 선택
  };

  return (
    <View style={styles.container}>
      {/* 프로필 리스트 (가로 스크롤 가능) */}
      <FlatList
        data={profiles}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.profileButton,
              selectedProfileIndex === index && styles.selectedProfile,
            ]}
            onPress={() => onSelectProfile(index)}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileText}>
                {item.pet_name?.charAt(0) || 'N'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* 추가 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddAndSelectProfile}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 프로필 간격
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  selectedProfile: {
    borderWidth: 3,
    borderColor: '#008080', // 테두리 색상 (teal-800)
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d5db', // gray-300
  },
  addText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PetProfileList;
