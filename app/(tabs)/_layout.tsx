import { Tabs } from 'expo-router';
import React from 'react';

import { Theme } from '../../constants/theme';
import { Timer, BarChart2, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textLight,
        headerShown: true,
        headerStyle: { backgroundColor: Theme.colors.background },
        headerTitleStyle: { 
          color: Theme.colors.text, 
          fontFamily: Theme.typography.fontFamily,
          fontWeight: 'bold'
        },
        tabBarStyle: {
          backgroundColor: Theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: Theme.colors.border,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'โฟกัส',
          tabBarIcon: ({ color }) => <Timer color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'สถิติ',
          tabBarIcon: ({ color }) => <BarChart2 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'ตั้งค่า (RPA)',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
