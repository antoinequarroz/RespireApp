import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setProfile = useUserStore((state) => state.setProfile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
      }}
    >
      <View style={{ gap: SPACING.xl }}>
        <View
          style={{
            marginTop: SPACING.xxl,
            borderRadius: 20,
            backgroundColor: colors.bgCard,
            borderColor: colors.bgCardBorder,
            borderWidth: 0.5,
            padding: SPACING.xl,
          }}
        >
          <AppLogo size="hero" />
          <Text
            style={[
              FONTS.black,
              {
                color: colors.textPrimary,
                fontSize: 18,
                marginTop: SPACING.lg,
              },
            ]}
          >
            {i18n.t('onboarding.welcomeTitle')}
          </Text>
          <Text
            style={[
              FONTS.regular,
              {
                color: colors.textSecondary,
                fontSize: 13,
                marginTop: SPACING.sm,
              },
            ]}
          >
            {i18n.t('onboarding.welcomeBody')}
          </Text>
        </View>

        <Card>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('app.tagline')}
          </Text>
        </Card>
      </View>

      <View style={{ gap: SPACING.md }}>
        <Button label={i18n.t('common.continue')} onPress={() => router.push('/setup')} />
        {__DEV__ ? (
          <Button
            label={i18n.t('onboarding.devSkip')}
            variant="ghost"
            onPress={() => {
              const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
              setProfile({ lastCigaretteAt: now, cigarettesPerDay: 12, packPrice: 11.5 });
              completeOnboarding();
              router.replace('/');
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
