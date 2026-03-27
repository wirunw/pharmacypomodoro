import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { Theme } from '../../constants/theme';
import { Settings, Shield, Server, Bot, Wifi } from 'lucide-react-native';

export default function SettingsScreen() {
  const { intervalMode, setIntervalMode } = usePomodoroStore();
  const [showRPADashboard, setShowRPADashboard] = useState(false);
  const [posConnected, setPosConnected] = useState(true);
  const [botActive, setBotActive] = useState(true);

  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
    setTapCount(prev => prev + 1);
    if (tapCount + 1 >= 5) {
      setShowRPADashboard(true);
      setTapCount(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={handleSecretTap}>
        <Text style={styles.header}>ตั้งค่าเวลา</Text>
      </TouchableOpacity>
      
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>ช่วงเวลาปกติ (ค่าเริ่มต้น)</Text>
            <Text style={styles.settingSubtitle}>โฟกัส 25 นาที / พัก 5 นาที</Text>
          </View>
          <Switch
            trackColor={{ false: Theme.colors.border, true: Theme.colors.success }}
            thumbColor={Theme.colors.white}
            value={intervalMode === 'Quiet Time'}
            onValueChange={(val) => setIntervalMode(val ? 'Quiet Time' : 'Peak Hours')}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View>
            <Text style={styles.settingTitle}>ช่วงเวลาเร่งด่วน</Text>
            <Text style={styles.settingSubtitle}>โฟกัส 15 นาที / พัก 3 นาที</Text>
          </View>
          <Switch
            trackColor={{ false: Theme.colors.border, true: Theme.colors.danger }}
            thumbColor={Theme.colors.white}
            value={intervalMode === 'Peak Hours'}
            onValueChange={(val) => setIntervalMode(val ? 'Peak Hours' : 'Quiet Time')}
          />
        </View>
      </View>

      {/* Hidden RPA Dashboard */}
      {showRPADashboard && (
        <>
          <Text style={[styles.header, { color: Theme.colors.primary, marginTop: Theme.spacing.l }]}>
            <Shield size={20} color={Theme.colors.primary} /> แดชบอร์ดนักพัฒนา & RPA
          </Text>

          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.rpaInfo}>
                <Server size={24} color={posConnected ? Theme.colors.success : Theme.colors.danger} />
                <View style={{ marginLeft: Theme.spacing.m }}>
                  <Text style={styles.settingTitle}>การเชื่อมต่อระบบ POS</Text>
                  <Text style={styles.settingSubtitle}>{posConnected ? 'เชื่อมต่อแล้ว (RxStream v2.1)' : 'ไม่ได้เชื่อมต่อ'}</Text>
                </View>
              </View>
              <Switch
                value={posConnected}
                onValueChange={setPosConnected}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.rpaInfo}>
                <Bot size={24} color={botActive ? Theme.colors.primary : Theme.colors.textLight} />
                <View style={{ marginLeft: Theme.spacing.m }}>
                  <Text style={styles.settingTitle}>สถานะบอท RX-Check</Text>
                  <Text style={styles.settingSubtitle}>{botActive ? 'กำลังรันคิวตรวจสอบใบสั่งยา' : 'ว่างงาน'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.syncBtn} onPress={() => setBotActive(!botActive)}>
                <Wifi size={16} color={Theme.colors.white} />
                <Text style={styles.syncBtnText}>{botActive ? 'พักชั่วคราว' : 'เริ่มทำงาน'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowRPADashboard(false)} style={{ alignItems: 'center' }}>
            <Text style={{ color: Theme.colors.textLight }}>ซ่อนเครื่องมือนักพัฒนา</Text>
          </TouchableOpacity>
        </>
      )}

      {/* About */}
      <Text style={styles.header}>เกี่ยวกับ</Text>
      <View style={[styles.section, { alignItems: 'center', paddingVertical: Theme.spacing.xl }]}>
        <Text style={styles.settingTitle}>PharmaPomodoro v1.0.0</Text>
        <Text style={styles.settingSubtitle}>สร้างสรรค์เพื่อเภสัชกรชุมชน</Text>
      </View>
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
  },
  section: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.large,
    paddingHorizontal: Theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: Theme.spacing.l,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  settingTitle: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  settingSubtitle: {
    fontSize: Theme.typography.sizes.small,
    color: Theme.colors.textLight,
    marginTop: 4,
  },
  rpaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderRadius: Theme.borderRadius.round,
  },
  syncBtnText: {
    color: Theme.colors.white,
    fontSize: Theme.typography.sizes.small,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
