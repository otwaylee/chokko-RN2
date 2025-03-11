import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface LineChartProps {
  labels: string[]; // x축 레이블
  dataValues: number[]; // 데이터 값
  unit: string; // 데이터 단위
}

const CustomLineChart: React.FC<LineChartProps> = ({
  labels,
  dataValues,
  unit,
}) => {
  const MAX_VISIBLE_DATA = 7; // 최근 7개 데이터만 표시
  const recentLabels = labels.slice(-MAX_VISIBLE_DATA);
  const recentDataValues = dataValues.slice(-MAX_VISIBLE_DATA);

  // `gifted-charts`용 데이터 변환
  const chartData = recentDataValues.map((value, index) => ({
    value,
    label: recentLabels[index],
  }));

  return (
    <View style={{ alignItems: 'center', padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        최근 {MAX_VISIBLE_DATA}개 데이터 ({unit})
      </Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} // 화면 너비 조정
        height={200}
        thickness={2}
        hideRules
        xAxisLabelTextStyle={{ fontSize: 12, color: 'gray' }}
        yAxisLabelSuffix={` ${unit}`} // y축에 단위 표시
        color='rgba(75, 192, 192, 1)' // 선 색상
        dataPointsColor='rgba(75, 192, 192, 1)' // 데이터 포인트 색상
        dataPointsRadius={4}
        startFillColor='rgba(75, 192, 192, 0.2)' // 영역 색상
        endFillColor='rgba(75, 192, 192, 0)' // 영역 색상 끝 부분
        startOpacity={0.7}
        endOpacity={0.1}
        maxValue={Math.max(...recentDataValues) + 5} // 최대값 조정
      />
    </View>
  );
};

export default CustomLineChart;
