import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePomodoroStore } from '../store/pomodoroStore';
import { Theme } from '../constants/theme';
import { Lightbulb, Activity } from 'lucide-react-native';

const FACTS = [
  { type: 'เกร็ดความรู้เรื่องยา', text: 'Amoxicillin ควรทานหลังอาหารเพื่อลดอาการระคายเคืองกระเพาะ', icon: Lightbulb },
  { type: 'ท่าทาง', text: 'หมุนไหล่ไปด้านหลังและเก็บคางเล็กน้อยเพื่อป้องกันอาการปวดคอ', icon: Activity },
  { type: 'เกร็ดความรู้เรื่องยา', text: 'น้ำเกรปฟรุตสามารถรบกวนการเผาผลาญของยากลุ่ม Statins ทำให้เสี่ยงต่อผลข้างเคียง', icon: Lightbulb },
  { type: 'ยืดเหยียด', text: 'ยืดข้อมือไปด้านหลังเบาๆ 15 วินาทีเพื่อลดอาการเมื่อยล้าจากการพิมพ์', icon: Activity },
];

export const SmartBreaks = () => {
  const { status } = usePomodoroStore();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    if (status === 'Break') {
      setCurrentFactIndex(Math.floor(Math.random() * FACTS.length));
    }
  }, [status]);

  if (status !== 'Break') return null;

  const fact = FACTS[currentFactIndex];
  const Icon = fact.icon;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon color={Theme.colors.primary} size={20} />
        <Text style={styles.title}>{fact.type}</Text>
      </View>
      <Text style={styles.factText}>รู้หรือไม่: {fact.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEA',
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.medium,
    marginVertical: Theme.spacing.m,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FBE096',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
  },
  title: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.s,
  },
  factText: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.text,
    lineHeight: 24,
  },
});
