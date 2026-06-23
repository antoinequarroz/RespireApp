import { type Href, useRouter } from 'expo-router';
import { Monitor, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { SettingsNavItem } from '@/components/ui/SettingsNavItem';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';
import { useUserStore } from '@/store/userStore';

const SECTION_LABEL_STYLE = {
  fontSize: 8,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const language = useUserStore((state) => state.language);
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);
  const isPremium = usePremiumStore((state) => state.isPremium);

  const pushSettings = (path: string) => router.push(path as Href);
  const productType = profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const currency = profile?.currency ?? 'EUR';
  const cadenceLabel =
    productConfig.quantityCadence === 'day'
      ? i18n.t('settingsScreen.perDay')
      : i18n.t('settingsScreen.perWeek');

  const profileSummary = profile
    ? `${i18n.t(`products.${productType}.title`)} · ${profile.cigarettesPerDay} ${cadenceLabel} · ${profile.packPrice} ${currency}`
    : i18n.t('settingsScreen.profileEmpty');

  const themeOptions = [
    { key: 'dark' as const, label: i18n.t('common.dark'), Icon: Moon },
    { key: 'light' as const, label: i18n.t('common.light'), Icon: Sun },
    { key: 'system' as const, label: i18n.t('common.system'), Icon: Monitor },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      {/* Header */}
      <View style={{ gap: 6 }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.subtitle')}
        </Text>
      </View>

      {/* Profil */}
      <View style={{ gap: 6 }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, ...SECTION_LABEL_STYLE }]}>
          {i18n.t('settingsScreen.profileSection')}
        </Text>
        <Card style={{ backgroundColor: colors.bgSurface, paddingVertical: 0 }}>
          <SettingsNavItem
            label={i18n.t('settingsScreen.profile')}
            value={profileSummary}
            onPress={() => pushSettings('/settings/profile')}
          />
          <SettingsNavItem
            label={i18n.t('settingsScreen.notifications')}
            value={
              reminderEnabled
                ? i18n.t('settingsScreen.notificationsOn')
                : i18n.t('settingsScreen.notificationsOff')
            }
            onPress={() => pushSettings('/settings/notifications')}
          />
        </Card>
      </View>

      {/* Apparence */}
      <View style={{ gap: 6 }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, ...SECTION_LABEL_STYLE }]}>
          {i18n.t('settingsScreen.appearanceSection')}
        </Text>
        <Card style={{ backgroundColor: colors.bgSurface, gap: 12 }}>
          {/* Toggle thème */}
          <View style={{ gap: 6 }}>
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12 }]}>
              {i18n.t('common.theme')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {themeOptions.map(({ key, label, Icon }) => {
                const active = theme === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setTheme(key)}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      paddingVertical: 9,
                      borderRadius: RADII.md,
                      borderWidth: active ? 1.5 : 0.5,
                      borderColor: active ? colors.accent : colors.bgCardBorder,
                      backgroundColor: active ? colors.accentBg : colors.bgCard,
                    }}
                  >
                    <Icon
                      size={13}
                      color={active ? colors.accent : colors.textMuted}
                      strokeWidth={1.5}
                    />
                    <Text
                      style={[
                        FONTS.bold,
                        { fontSize: 11, color: active ? colors.accent : colors.textSecondary },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Langue */}
          <View style={{ borderTopWidth: 0.5, borderTopColor: colors.divider, marginHorizontal: -12, paddingHorizontal: 12 }}>
            <SettingsNavItem
              label={i18n.t('settingsScreen.language')}
              value={language.toUpperCase()}
              onPress={() => pushSettings('/settings/language')}
            />
          </View>
        </Card>
      </View>

      {/* Abonnement */}
      <View style={{ gap: 6 }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, ...SECTION_LABEL_STYLE }]}>
          {i18n.t('settingsScreen.subscriptionSection')}
        </Text>
        <Card style={{ backgroundColor: colors.bgSurface, paddingVertical: 0 }}>
          <SettingsNavItem
            label={i18n.t('settingsScreen.subscription')}
            value={isPremium ? i18n.t('common.premium') : i18n.t('common.free')}
            badge={isPremium ? i18n.t('common.premium') : undefined}
            onPress={() => pushSettings('/settings/subscription')}
          />
          {!isPremium ? (
            <SettingsNavItem label={i18n.t('settingsScreen.goPremium')} onPress={() => router.push('/paywall')} />
          ) : null}
        </Card>
      </View>

      {/* Contenu */}
      <View style={{ gap: 6 }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, ...SECTION_LABEL_STYLE }]}>
          Contenu
        </Text>
        <Card style={{ backgroundColor: colors.bgSurface, paddingVertical: 0 }}>
          <SettingsNavItem
            label="Phrases sauvegardées"
            onPress={() => pushSettings('/settings/saved-phrases')}
          />
        </Card>
      </View>

      {/* À propos */}
      <View style={{ gap: 6 }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, ...SECTION_LABEL_STYLE }]}>
          {i18n.t('settingsScreen.aboutSection')}
        </Text>
        <Card style={{ backgroundColor: colors.bgSurface, paddingVertical: 0 }}>
          <SettingsNavItem
            label={i18n.t('settingsScreen.about')}
            value="1.0.0"
            onPress={() => pushSettings('/settings/about')}
          />
        </Card>
      </View>
    </ScrollView>
  );
}
