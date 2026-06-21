import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { i18n } from '@/services/i18n';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1B6CA8',
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: i18n.t('tabs.stats'),
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: i18n.t('tabs.journal'),
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
