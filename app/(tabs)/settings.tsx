import { type Href, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { SettingsNavItem } from '@/components/ui/SettingsNavItem';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';
import { useUserStore } from '@/store/userStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const language = useUserStore((state) => state.language);
  const theme = useUserStore((state) => state.theme);
  const isPremium = usePremiumStore((state) => state.isPremium);

  const pushSettings = (path: string) => router.push(path as Href);

  const profileSummary = profile
    ? `${profile.cigarettesPerDay} / jour • ${profile.packPrice} EUR`
    : i18n.t('settingsScreen.profileEmpty');

  const themeSummary =
    theme === 'system' ? i18n.t('common.system') : theme === 'dark' ? i18n.t('common.dark') : i18n.t('common.light');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.subtitle')}
        </Text>
      </View>

      <Card style={{ backgroundColor: colors.bgSurface }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('settingsScreen.profileSection')}
        </Text>
        <SettingsNavItem
          label={i18n.t('settingsScreen.profile')}
          value={profileSummary}
          onPress={() => pushSettings('/settings/profile')}
        />
        <SettingsNavItem
          label={i18n.t('settingsScreen.notifications')}
          value={reminderEnabled ? i18n.t('settingsScreen.notificationsOn') : i18n.t('settingsScreen.notificationsOff')}
          onPress={() => pushSettings('/settings/notifications')}
        />
      </Card>

      <Card style={{ backgroundColor: colors.bgSurface }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('settingsScreen.appearanceSection')}
        </Text>
        <SettingsNavItem
          label={i18n.t('common.theme')}
          value={themeSummary}
          onPress={() => pushSettings('/settings/appearance')}
        />
        <SettingsNavItem
          label={i18n.t('settingsScreen.language')}
          value={language.toUpperCase()}
          onPress={() => pushSettings('/settings/language')}
        />
      </Card>

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
        }}
      >
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.accent,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('settingsScreen.subscriptionSection')}
        </Text>
        <SettingsNavItem
          label={i18n.t('settingsScreen.subscription')}
          value={isPremium ? i18n.t('common.premium') : i18n.t('common.free')}
          badge={isPremium ? i18n.t('common.premium') : undefined}
          onPress={() => pushSettings('/settings/subscription')}
        />
        {!isPremium ? (
          <SettingsNavItem
            label={i18n.t('settingsScreen.goPremium')}
            onPress={() => router.push('/paywall')}
          />
        ) : null}
      </Card>

      <Card style={{ backgroundColor: colors.bgSurface }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('settingsScreen.aboutSection')}
        </Text>
        <SettingsNavItem
          label={i18n.t('settingsScreen.about')}
          value="1.0.0"
          onPress={() => pushSettings('/settings/about')}
        />
      </Card>
    </ScrollView>
  );
}
