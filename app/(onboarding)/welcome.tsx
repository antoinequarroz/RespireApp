import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.accentBg,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: colors.accent,
              }}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: SPACING.xl, gap: 8 }}>
          <AppLogo size="hero" />
          <Text
            style={[
              FONTS.regular,
              {
                color: colors.textMuted,
                fontSize: 13,
                textAlign: 'center',
              },
            ]}
          >
            {i18n.t('app.tagline')}
          </Text>
        </View>
      </View>

      <View style={{ gap: SPACING.md }}>
        <View style={{ gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('onboarding.heroLineOne')}
          </Text>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 18 }]}>
            {i18n.t('onboarding.heroLineTwo')}
          </Text>
        </View>

        <Button label={i18n.t('onboarding.startCta')} onPress={() => router.push('/setup')} />

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
        ) : (
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13, textAlign: 'center' }]}>
            {i18n.t('onboarding.secondaryLink')} →
          </Text>
        )}
      </View>
    </View>
  );
}
