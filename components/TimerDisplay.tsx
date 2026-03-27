import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { usePomodoroStore } from '../store/pomodoroStore';
import { Theme } from '../constants/theme';

const TimerDisplay = () => {
  const { timeLeft, status, intervalMode } = usePomodoroStore();

  const getDuration = () => {
    if (status === 'Break') {
      return intervalMode === 'Quiet Time' ? 5 * 60 : 3 * 60;
    }
    return intervalMode === 'Quiet Time' ? 25 * 60 : 15 * 60;
  };

  const totalDuration = getDuration();
  const progress = timeLeft / totalDuration;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  let strokeColor = Theme.colors.primary;
  if (status === 'Break') strokeColor = Theme.colors.success;
  if (status === 'Paused') strokeColor = Theme.colors.textLight;

  const getStatusText = () => {
    switch (status) {
      case 'Idle': return 'พร้อมโฟกัส';
      case 'Focusing': return 'กำลังโฟกัส';
      case 'Paused': return 'พักชั่วคราว';
      case 'Break': return 'เวลาพัก';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          stroke={Theme.colors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Foreground Circle - Progress */}
        <Circle
          stroke={strokeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.timeText, { color: strokeColor }]}>{timeString}</Text>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.spacing.xl,
    position: 'relative',
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: Theme.typography.sizes.display,
    fontWeight: Theme.typography.weights.bold as any,
    fontFamily: Theme.typography.fontFamily,
  },
  statusText: {
    fontSize: Theme.typography.sizes.h3,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.s,
    fontWeight: Theme.typography.weights.medium as any,
  },
});

export default TimerDisplay;
