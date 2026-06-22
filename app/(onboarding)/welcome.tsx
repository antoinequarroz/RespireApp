import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function BrandMark() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: 76,
        height: 76,
        borderRadius: RADII.full,
        borderWidth: 1,
        borderColor: colors.accentBorder,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: RADII.full,
          borderWidth: 1,
          borderColor: colors.accentBorder,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: RADII.full,
            backgroundColor: colors.accent,
          }}
        />
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboardingDraft = useUserStore((state) => state.setOnboardingDraft);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const startOnboarding = () => {
    setOnboardingDraft(
      profile ?? {
        lastCigaretteAt: new Date().toISOString(),
        cigarettesPerDay: 10,
        packPrice: 11.5,
        motivations: [],
      },
    );
    router.push('/last-cigarette');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.lg,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: SPACING.lg }}>
          <BrandMark />
          <View style={{ alignItems: 'center', gap: 8 }}>
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
              {i18n.t('onboarding.logoTagline')}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ gap: SPACING.xl }}>
        <View style={{ gap: 2 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, lineHeight: 24 }]}>
            {i18n.t('onboarding.heroLineOne')}
          </Text>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 18, lineHeight: 24 }]}>
            {i18n.t('onboarding.heroLineTwo')}
          </Text>
        </View>

        <Button label={i18n.t('onboarding.startCta')} onPress={startOnboarding} />

        {__DEV__ ? (
          <Button
            label={i18n.t('onboarding.devSkip')}
            variant="ghost"
            onPress={() => {
              const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
              setProfile({ lastCigaretteAt: now, cigarettesPerDay: 12, packPrice: 11.5, motivations: [] });
              completeOnboarding();
              router.replace('/(tabs)');
            }}
          />
        ) : (
          <Pressable onPress={startOnboarding}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13, textAlign: 'center' }]}>
              {i18n.t('onboarding.secondaryLink')} {'->'}
            </Text>
          </Pressable>
        )}
      </View>

      <View
        style={{
          alignSelf: 'center',
          width: 104,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.dividerStrong,
          marginTop: SPACING.lg,
        }}
      />
    </View>
  );
}
