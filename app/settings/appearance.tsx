import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SettingsAppearanceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.appearanceTitle')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.appearanceBody')}
        </Text>
      </View>

      {(['dark', 'light', 'system'] as const).map((item) => {
        const active = theme === item;

        return (
          <Pressable
            key={item}
            onPress={() => {
              setTheme(item);
              router.back();
            }}
          >
            <Card
              style={{
                borderColor: active ? colors.accentBorder : colors.bgCardBorder,
                backgroundColor: active ? colors.accentBg : colors.bgCard,
                borderWidth: active ? 1 : 0.5,
                gap: 10,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
                  {i18n.t(`common.${item}`)}
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.accentBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {active ? <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: colors.accent }} /> : null}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    flex: 1,
                    height: 54,
                    borderRadius: RADII.md,
                    backgroundColor: item === 'light' ? '#F8F7FF' : '#120F1E',
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    height: 54,
                    borderRadius: RADII.md,
                    backgroundColor: item === 'dark' ? '#120F1E' : '#F8F7FF',
                    borderWidth: item === 'dark' ? 0 : 0.5,
                    borderColor: colors.bgCardBorder,
                  }}
                />
              </View>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
