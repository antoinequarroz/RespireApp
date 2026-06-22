import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 4,
          backgroundColor: colors.navBg,
          borderTopWidth: 0.5,
          borderTopColor: colors.navBorder,
        },
        tabBarLabelStyle: {
          ...FONTS.regular,
          fontSize: 8,
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={18} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                focused ? FONTS.bold : FONTS.regular,
                {
                  color,
                  fontSize: 8,
                },
              ]}
            >
              {i18n.t('tabs.home')}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: i18n.t('tabs.stats'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={18} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[focused ? FONTS.bold : FONTS.regular, { color, fontSize: 8 }]}>
              {i18n.t('tabs.stats')}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: i18n.t('tabs.journal'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={18} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[focused ? FONTS.bold : FONTS.regular, { color, fontSize: 8 }]}>
              {i18n.t('tabs.journal')}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('tabs.settings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={18} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[focused ? FONTS.bold : FONTS.regular, { color, fontSize: 8 }]}>
              {i18n.t('tabs.settings')}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
