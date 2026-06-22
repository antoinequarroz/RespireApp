import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

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
          height: 64,
          paddingTop: 10,
          paddingBottom: 8,
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
            <Text style={[focused ? FONTS.bold : FONTS.regular, { color, fontSize: 8 }]}>
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
            <View style={{ position: 'relative' }}>
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={18} />
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  backgroundColor: '#7C3AED',
                  borderRadius: 4,
                  paddingHorizontal: 3,
                  paddingVertical: 1,
                }}
              >
                <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 6 }]}>PRO</Text>
              </View>
            </View>
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
