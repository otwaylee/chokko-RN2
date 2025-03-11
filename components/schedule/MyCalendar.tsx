import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function Home() {
  const handleModalButton = () => {
    router.push('/');
  };

  return (
    <View>
      <Text>Home </Text>

      <Calendar
        markingType={'period'}
        markedDates={{
          '2024-12-20': { textColor: 'green' },
          '2024-12-22': { startingDay: true, color: 'green' },
          '2024-12-23': {
            selected: true,
            endingDay: true,
            color: 'green',
            textColor: 'gray',
          },
          '2024-12-04': {
            disabled: true,
            startingDay: true,
            color: 'green',
            endingDay: true,
          },
        }}
        enableSwipeMonths={true}
        hideArrows={false}
      />
      <Button title='모달' onPress={handleModalButton}></Button>
    </View>
  );
}
