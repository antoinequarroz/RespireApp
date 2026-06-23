import { Pressable, ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SettingsAppearanceScreen() {
  const { colors } = useTheme();
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);

  const options = [
    { key: 'dark', label: i18n.t('common.dark'), subtitle: i18n.t('settingsScreen.appearanceDarkHint') },
    { key: 'light', label: i18n.t('common.light'), subtitle: i18n.t('settingsScreen.appearanceLightHint') },
    { key: 'system', label: i18n.t('common.system'), subtitle: i18n.t('settingsScreen.appearanceSystemHint') },
  ] as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SettingsScreenHeader
        title={i18n.t('settingsScreen.appearanceTitle')}
        subtitle={i18n.t('settingsScreen.appearanceBody')}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.xxl,
          gap: SPACING.lg,
        }}
      >

      {options.map((item) => {
        const active = theme === item.key;

        return (
          <Pressable key={item.key} onPress={() => setTheme(item.key)}>
            <Card
              style={{
                borderColor: active ? colors.accent : colors.bgCardBorder,
                backgroundColor: active ? colors.accentBg : colors.bgCard,
                borderWidth: active ? 1.5 : 0.5,
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: colors.bgCardBorder,
                  }}
                >
                  {item.key === 'system' ? (
                    <>
                      <View style={{ flex: 1, backgroundColor: colors.bgDeep }} />
                      <View style={{ flex: 1, backgroundColor: '#F8F7FF' }} />
                    </>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: item.key === 'dark' ? colors.bgDeep : '#F8F7FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: item.key === 'dark' ? colors.bgCard : '#EDE9FF',
                          borderWidth: 1,
                          borderColor: colors.accentBorder,
                        }}
                      />
                    </View>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12 }]}>{item.label}</Text>
                  <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, marginTop: 2 }]}>
                    {item.subtitle}
                  </Text>
                </View>

                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: RADII.full,
                    borderWidth: 1.5,
                    borderColor: active ? colors.accent : colors.accentBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {active ? (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: RADII.full,
                        backgroundColor: colors.accent,
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}
      </ScrollView>
    </View>
  );
}
