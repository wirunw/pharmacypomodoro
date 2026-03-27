import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePomodoroStore } from '../store/pomodoroStore';
import { Theme } from '../constants/theme';

export const DailyProgress = () => {
  const { pomodorosCompleted, categoryLogs } = usePomodoroStore();
  const goal = 12;

  const renderDots = () => {
    const dots = [];
    const entries = Object.entries(categoryLogs);
    
    const completedColors: string[] = [];
    entries.forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        let color = Theme.colors.success;
        if (category === 'Clinical Work') color = Theme.colors.categoryClinical;
        if (category === 'Inventory Management') color = Theme.colors.categoryInventory;
        if (category === 'Administrative Tasks') color = Theme.colors.categoryAdmin;
        if (category === 'Academic/RPA Monitoring') color = Theme.colors.categoryRPA;
        completedColors.push(color);
      }
    });

    for (let i = 0; i < goal; i++) {
      const isCompleted = i < pomodorosCompleted;
      const dotColor = isCompleted ? completedColors[i] : Theme.colors.border;
      
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: dotColor, opacity: isCompleted ? 1 : 0.5 }
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ความคืบหน้าประจำวัน</Text>
      <View style={styles.dotsContainer}>
        {renderDots()}
      </View>
      <Text style={styles.subtitle}>
        ทำสำเร็จ {pomodorosCompleted}/{goal} รอบ
      </Text>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Theme.colors.categoryClinical }]}/>
          <Text style={styles.legendText}>คลินิก</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Theme.colors.categoryInventory }]}/>
          <Text style={styles.legendText}>คลังยา</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Theme.colors.categoryAdmin }]}/>
          <Text style={styles.legendText}>บริหาร</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Theme.colors.categoryRPA }]}/>
          <Text style={styles.legendText}>RPA</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.large,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginTop: Theme.spacing.l,
    alignSelf: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.m,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Theme.spacing.m,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.small,
    color: Theme.colors.textLight,
  },
  legend: {
    flexDirection: 'row',
    marginTop: Theme.spacing.m,
    justifyContent: 'flex-start',
    gap: Theme.spacing.m,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: Theme.colors.textLight,
  },
});
