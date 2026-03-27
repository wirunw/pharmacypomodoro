import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { usePomodoroStore } from '../store/pomodoroStore';
import { Theme } from '../constants/theme';
import { AlertTriangle, X } from 'lucide-react-native';

const INTERRUPTIONS = [
  { id: 'Dispensing', label: 'จ่ายยา' },
  { id: 'Consultation', label: 'ให้คำปรึกษา' },
  { id: 'OTC Recommendation', label: 'แนะนำยา OTC' },
  { id: 'Inquiry', label: 'ตอบคำถาม' },
];

export const InterruptionsMenu = () => {
  const { status, pauseForCustomer, resumeFocus } = usePomodoroStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleServeCustomer = () => {
    pauseForCustomer();
    setModalVisible(true);
  };

  const handleLogInterruption = (type: string) => {
    // In a real app we might update the log type here
    setModalVisible(false);
  };

  const handleResume = () => {
    resumeFocus();
    setModalVisible(false);
  };

  if (status !== 'Focusing' && status !== 'Paused') {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.serveBtn, status === 'Paused' && styles.serveBtnActive]}
        onPress={status === 'Focusing' ? handleServeCustomer : handleResume}
      >
        <AlertTriangle color={Theme.colors.white} size={24} style={{ marginRight: 8 }} />
        <Text style={styles.serveBtnText}>
          {status === 'Paused' ? 'กลับไปโฟกัส' : 'บริการลูกค้า'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>พักเวลาชั่วคราว</Text>
              <TouchableOpacity onPress={handleResume}>
                <X color={Theme.colors.textLight} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>เลือกประเภทการบริการ:</Text>
            
            <View style={styles.optionsGrid}>
              {INTERRUPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionBtn}
                  onPress={() => handleLogInterruption(item.id)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.skipBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.skipText}>ข้ามการบันทึก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.m,
    width: '100%',
    alignItems: 'center',
  },
  serveBtn: {
    backgroundColor: Theme.colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.round,
    width: '90%',
    shadowColor: Theme.colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  serveBtnActive: {
    backgroundColor: Theme.colors.success,
    shadowColor: Theme.colors.success,
  },
  serveBtnText: {
    color: Theme.colors.white,
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 45, 66, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.l,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.danger,
  },
  modalSubtitle: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.m,
  },
  optionsGrid: {
    flexDirection: 'column',
    gap: Theme.spacing.s,
  },
  optionBtn: {
    backgroundColor: Theme.colors.background,
    paddingVertical: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.l,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  optionText: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
    textAlign: 'center',
  },
  skipBtn: {
    marginTop: Theme.spacing.l,
    alignItems: 'center',
  },
  skipText: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.small,
  },
});
