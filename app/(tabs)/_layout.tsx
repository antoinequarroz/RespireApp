import { Tabs } from 'expo-router';
import { BarChart3, BookHeart, Home, Settings, Sparkles } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';

export default function TabsLayout() {
  const { colors, fixed } = useTheme();
  const isPremium = usePremiumStore((state) => state.isPremium);

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
          tabBarIcon: ({ color }) => <Home color={color} size={18} strokeWidth={1.5} />,
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
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={18} strokeWidth={1.5} />,
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
          tabBarIcon: ({ color }) => (
            <View style={{ position: 'relative' }}>
              <BookHeart color={color} size={18} strokeWidth={1.5} />
              {!isPremium ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    backgroundColor: fixed.purple,
                    borderRadius: 4,
                    paddingHorizontal: 3,
                    paddingVertical: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Sparkles color="#FFFFFF" size={6} strokeWidth={1.5} />
                  <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 6 }]}>PRO</Text>
                </View>
              ) : null}
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
          tabBarIcon: ({ color }) => <Settings color={color} size={18} strokeWidth={1.5} />,
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
