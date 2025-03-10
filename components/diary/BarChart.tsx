import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface BarChartProps {
  labels: string[]; // x축 레이블
  dataValues: number[]; // 데이터 값
  unit: string; // 데이터 단위
}

const COLORS = [
  'rgba(255, 99, 132, 1)', // 빨강
  'rgba(54, 162, 235, 1)', // 파랑
  'rgba(255, 206, 86, 1)', // 노랑
  'rgba(75, 192, 192, 1)', // 초록
  'rgba(153, 102, 255, 1)', // 보라
  'rgba(255, 159, 64, 1)', // 주황
  'rgba(75, 192, 192, 1)', // 초록 (반복)
];

const CustomBarChart: React.FC<BarChartProps> = ({
  labels,
  dataValues,
  unit,
}) => {
  const MAX_VISIBLE_DATA = 7; // 최근 7개의 데이터만 표시
  const recentLabels = labels.slice(-MAX_VISIBLE_DATA);
  const recentDataValues = dataValues.slice(-MAX_VISIBLE_DATA);

  // Gifted Charts에 맞는 데이터 변환
  const chartData = recentDataValues.map((value, index) => ({
    value,
    label: recentLabels[index],
    frontColor: COLORS[index % COLORS.length], // 바 색상
  }));

  return (
    <View className='flex items-center p-2'>
      <Text className='text-base font-bold mb-2'>
        최근 {MAX_VISIBLE_DATA}개 데이터 ({unit})
      </Text>
      <BarChart
        data={chartData}
        isAnimated
        barWidth={30}
        spacing={15}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisLabelSuffix={` ${unit}`} // 단위 표시
        showValuesAsTopLabel
        width={Dimensions.get('window').width - 40} // 화면 너비 조정
        noOfSections={4} // y축 최대 구간 개수
        maxValue={Math.max(...recentDataValues) + 5} // 최대값보다 살짝 크게 설정
      />
    </View>
  );
};

export default CustomBarChart;
