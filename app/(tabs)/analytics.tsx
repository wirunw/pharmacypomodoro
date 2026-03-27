import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { Theme } from '../../constants/theme';
import { PieChart, BarChart } from 'react-native-chart-kit';

const CAT_DISPLAY: Record<string, string> = {
  'Clinical Work': 'งานคลินิก',
  'Inventory Management': 'คลังยา',
  'Administrative Tasks': 'งานบริหาร',
  'Academic/RPA Monitoring': 'RPA',
};

export default function AnalyticsScreen() {
  const { categoryLogs, serveLogs } = usePomodoroStore();
  const screenWidth = Dimensions.get('window').width;

  // Process category data
  const categoryData = Object.entries(categoryLogs).map(([name, count], index) => {
    let color = Theme.colors.primary;
    if (name === 'Clinical Work') color = Theme.colors.categoryClinical;
    if (name === 'Inventory Management') color = Theme.colors.categoryInventory;
    if (name === 'Administrative Tasks') color = Theme.colors.categoryAdmin;
    if (name === 'Academic/RPA Monitoring') color = Theme.colors.categoryRPA;
    return {
      name: CAT_DISPLAY[name] || name,
      count,
      color,
      legendFontColor: Theme.colors.text,
      legendFontSize: 12,
    };
  });

  // Process interruption logs
  const interruptionCounts = serveLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const types = Object.keys(interruptionCounts);
  const counts = Object.values(interruptionCounts);

  // We map the keys to Thai words if needed but earlier we passed raw ID like 'Dispensing'
  const INT_DISPLAY: Record<string, string> = {
    'Dispensing': 'จ่ายยา',
    'Consultation': 'ปรุงยา/แนะนำ',
    'OTC Recommendation': 'OTC',
    'Inquiry': 'ตอบคำถาม'
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>สัดส่วนการทำงาน (รอบโพโมโดโร)</Text>
      
      <View style={styles.chartContainer}>
        {Object.values(categoryLogs).reduce((a, b) => a + b, 0) === 0 ? (
          <Text style={styles.emptyText}>ยังไม่มีข้อมูล ลองทำโพโมโดโรให้จบสักรอบสิ!</Text>
        ) : (
          <PieChart
            data={categoryData}
            width={screenWidth - Theme.spacing.l * 2}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        )}
      </View>

      <Text style={styles.header}>รูปแบบการขัดจังหวะ (บริการลูกค้า)</Text>
      
      <View style={styles.chartContainer}>
        {counts.length === 0 ? (
          <Text style={styles.emptyText}>ยังไม่มีการบันทึกการขัดจังหวะ</Text>
        ) : (
          <BarChart
            data={{
              labels: types.map(t => INT_DISPLAY[t] || t.split(' ')[0]),
              datasets: [{ data: counts }],
            }}
            width={screenWidth - Theme.spacing.l * 2}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: Theme.colors.white,
              backgroundGradientFrom: Theme.colors.white,
              backgroundGradientTo: Theme.colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(43, 45, 66, ${opacity})`,
            }}
            style={{ borderRadius: Theme.borderRadius.medium }}
            verticalLabelRotation={0}
          />
        )}
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.l,
  },
  header: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.m,
  },
  chartContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Theme.colors.textLight,
    paddingVertical: Theme.spacing.xl,
    textAlign: 'center',
  },
});
