import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { Theme } from '../../constants/theme';
import TimerDisplay from '../../components/TimerDisplay';
import { InterruptionsMenu } from '../../components/InterruptionsMenu';
import { DailyProgress } from '../../components/DailyProgress';
import { SmartBreaks } from '../../components/SmartBreaks';
import { Play, Pause, FastForward, ChevronDown } from 'lucide-react-native';

const CATEGORIES = [
  'Clinical Work',
  'Inventory Management',
  'Administrative Tasks',
  'Academic/RPA Monitoring',
] as const;

const CAT_DISPLAY: Record<string, string> = {
  'Clinical Work': 'งานคลินิก',
  'Inventory Management': 'จัดการคลังยา',
  'Administrative Tasks': 'งานบริหาร',
  'Academic/RPA Monitoring': 'งานวิชาการ/RPA',
};

export default function FocusScreen() {
  const { 
    status, startFocus, tick, 
    currentCategory, setCategory, skipToBreak,
    userName
  } = usePomodoroStore();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'Focusing' || status === 'Break') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tick]);

  const handleStartPause = () => {
    if (status === 'Idle' || status === 'Break' || status === 'Paused') {
      startFocus();
    }
  };

  const statusLabel = () => {
    if (status === 'Idle' || status === 'Break') return 'เริ่มโฟกัส';
    if (status === 'Paused') return 'ทำต่อ';
    return 'กำลังโฟกัส...';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Profile / Greeting */}
        <View style={styles.headerRow}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>{userName ? userName.charAt(0).toUpperCase() : '?'}</Text>
          </View>
          <View>
            <Text style={styles.greetingHeader}>PharmaPomodoro</Text>
            <Text style={styles.greetingSub}>สวัสดี ภก. {userName}</Text>
          </View>
        </View>

        {/* Task Category Selector */}
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setCategoryModalVisible(true)}
          disabled={status === 'Focusing'}
        >
          <Text style={styles.categoryText}>{CAT_DISPLAY[currentCategory]}</Text>
          <ChevronDown color={Theme.colors.primary} size={20} />
        </TouchableOpacity>

        <TimerDisplay />

        {/* Start/Pause and Skip buttons */}
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlBtn, styles.primaryBtn]}
            onPress={handleStartPause}
            disabled={status === 'Focusing'}
          >
            {status === 'Idle' || status === 'Break' || status === 'Paused' ? (
              <Play color={Theme.colors.white} fill={Theme.colors.white} size={20} />
            ) : (
              <Pause color={Theme.colors.white} fill={Theme.colors.white} size={20} />
            )}
            <Text style={styles.controlBtnTextPrimary}>
              {statusLabel()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, styles.secondaryBtn]}
            onPress={skipToBreak}
            disabled={status === 'Break'}
          >
            <FastForward color={Theme.colors.primary} size={20} />
            <Text style={styles.controlBtnTextSecondary}>ข้ามไปพัก</Text>
          </TouchableOpacity>
        </View>

        <InterruptionsMenu />
        <SmartBreaks />
        <DailyProgress />
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal visible={categoryModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>เลือกงานปัจจุบัน</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={styles.modalItem}
                onPress={() => {
                  setCategory(cat as any);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{CAT_DISPLAY[cat]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setCategoryModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    padding: Theme.spacing.l,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  profileIconText: {
    color: Theme.colors.white,
    fontSize: Theme.typography.sizes.h3,
    fontWeight: 'bold',
  },
  greetingHeader: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textLight,
  },
  greetingSub: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.m,
    borderRadius: Theme.borderRadius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: Theme.spacing.m,
  },
  categoryText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginRight: Theme.spacing.s,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.m,
    marginVertical: Theme.spacing.l,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  secondaryBtn: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  controlBtnTextPrimary: {
    color: Theme.colors.white,
    fontSize: Theme.typography.sizes.body,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.s,
  },
  controlBtnTextSecondary: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.sizes.body,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.s,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: Theme.borderRadius.large,
    borderTopRightRadius: Theme.borderRadius.large,
    padding: Theme.spacing.xl,
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.l,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: Theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalItemText: {
    fontSize: Theme.typography.sizes.h3,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: Theme.spacing.l,
    paddingVertical: Theme.spacing.m,
  },
  modalCancelText: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.danger,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
