import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { APP_LINKS } from '@/constants/appLinks';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { STORAGE_KEYS } from '@/services/storage';
import { usePremiumStore } from '@/store/premiumStore';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function LinkRow({
  label,
  onPress,
  destructive = false,
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const { colors, fixed } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.divider,
      }}
    >
      <Text
        style={[
          FONTS.regular,
          { color: destructive ? fixed.sos : colors.textPrimary, fontSize: 13, flex: 1, paddingRight: 12 },
        ]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={14} color={destructive ? fixed.sos : colors.textMuted} />
    </Pressable>
  );
}

export default function SettingsAboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const resetDevState = async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS)).catch(() => undefined);

    useUserStore.setState({
      profile: null,
      onboardingDraft: null,
      hasCompletedOnboarding: false,
      hasHydrated: true,
      reminderEnabled: true,
      reminderHour: 19,
      reminderMinute: 0,
      milestoneNotificationsEnabled: true,
      motivationNotificationsEnabled: true,
      language: 'fr',
      theme: 'system',
    });

    useProgressStore.setState({
      journalEntries: [],
      celebratedMilestones: [],
      cravingsHandled: 0,
      lastSosMode: 'breathing',
      notificationPermissionGranted: false,
    });

    usePremiumStore.setState({
      isPremium: false,
      offerings: [],
      lastSyncAt: undefined,
    });

    router.replace('/');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        gap: SPACING.lg,
        paddingBottom: SPACING.xxl,
      }}
    >
      <SettingsScreenHeader
        title={i18n.t('settingsScreen.about')}
        subtitle={i18n.t('settingsScreen.aboutBody')}
      />

      <View
        style={{
          borderRadius: RADII.lg,
          borderWidth: 0.5,
          borderColor: colors.bgCardBorder,
          backgroundColor: colors.bgCard,
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <View
          style={{
            borderRadius: RADII.md,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgPrimary,
            paddingHorizontal: 12,
            paddingVertical: 12,
            gap: 4,
          }}
        >
          <Text
            style={[
              FONTS.bold,
              { color: colors.textMuted, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase' },
            ]}
          >
            {i18n.t('settingsScreen.versionLabel')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>{version}</Text>
        </View>

        <View>
          <LinkRow label={i18n.t('settingsScreen.legalTerms')} onPress={() => Linking.openURL(APP_LINKS.termsUrl)} />
          <LinkRow
            label={i18n.t('settingsScreen.legalPrivacy')}
            onPress={() => Linking.openURL(APP_LINKS.privacyUrl)}
          />
          <LinkRow
            label={i18n.t('settingsScreen.contactSupport')}
            onPress={() => Linking.openURL(APP_LINKS.supportEmail)}
          />
          <LinkRow
            label={i18n.t('settingsScreen.projectPage')}
            onPress={() => Linking.openURL(APP_LINKS.repositoryUrl)}
          />
          {__DEV__ ? (
            <LinkRow
              label={i18n.t('settingsScreen.resetDevData')}
              destructive
              onPress={() =>
                Alert.alert(i18n.t('settingsScreen.resetDevTitle'), i18n.t('settingsScreen.resetDevBody'), [
                  { text: i18n.t('common.cancel'), style: 'cancel' },
                  { text: i18n.t('common.confirm'), onPress: () => resetDevState().catch(() => undefined) },
                ])
              }
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
