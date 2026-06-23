import { type Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function HeroRings() {
  const { colors } = useTheme('dark');

  return (
    <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
      {[130, 108, 86, 64].map((size, index) => (
        <View
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: index === 3 ? 2 : 1,
            borderColor: index === 3 ? colors.accent : colors.accentBorder,
            opacity: index === 3 ? 0.75 : 0.6 - index * 0.1,
          }}
        />
      ))}
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.accentBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
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
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboardingDraft = useUserStore((state) => state.setOnboardingDraft);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const features = [
    {
      emoji: '⏱️',
      title: i18n.t('onboarding.pitchCounter'),
      body: 'Secondes, minutes, jours',
      bg: colors.accentBg,
      border: colors.accentBorder,
    },
    {
      emoji: '💰',
      title: i18n.t('onboarding.pitchMoney'),
      body: 'Calcule en temps réel',
      bg: colors.emeraldBg,
      border: colors.emeraldBorder,
    },
    {
      emoji: '🧘',
      title: i18n.t('onboarding.pitchSos'),
      body: 'Exercice de respiration',
      bg: colors.bgCard,
      border: colors.bgCardBorder,
    },
  ];

  const startOnboarding = () => {
    setOnboardingDraft(
      profile ?? {
        productType: 'cigarette',
        currency: 'EUR',
        lastCigaretteAt: new Date().toISOString(),
        cigarettesPerDay: 10,
        packPrice: 11.5,
        motivations: [],
      },
    );
    router.push('/(onboarding)/product-type' as Href);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgPrimary,
        paddingHorizontal: 28,
        paddingTop: 70,
        paddingBottom: 16,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
            }}
          />
          <AppLogo size="header" forceScheme="dark" />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
          <HeroRings />
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <AppLogo size="hero" forceScheme="dark" />
          </View>
        </View>

        <View style={{ gap: 18, paddingBottom: 10 }}>
          <View style={{ gap: 2, alignItems: 'flex-start' }}>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 30, lineHeight: 33 }]}>
              {i18n.t('onboarding.heroLineOne')}
            </Text>
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 30, lineHeight: 33 }]}>
              {i18n.t('onboarding.heroLineTwo')}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {features.map((feature) => (
              <View
                key={feature.title}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderRadius: 13,
                  borderWidth: 0.5,
                  borderColor: feature.border,
                  backgroundColor: colors.bgCard,
                  paddingHorizontal: 12,
                  paddingVertical: 11,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: feature.bg,
                    borderWidth: 0.5,
                    borderColor: feature.border,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{feature.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12 }]}>
                    {feature.title}
                  </Text>
                  <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, marginTop: 1 }]}>
                    {feature.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Button label={i18n.t('onboarding.startCta')} onPress={startOnboarding} />

          {__DEV__ ? (
            <Button
              label={i18n.t('onboarding.devSkip')}
              variant="ghost"
              onPress={() => {
                const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
                setProfile({
                  productType: 'cigarette',
                  currency: 'EUR',
                  lastCigaretteAt: now,
                  cigarettesPerDay: 12,
                  packPrice: 11.5,
                  motivations: [],
                });
                completeOnboarding();
                router.replace('/(tabs)');
              }}
            />
          ) : (
            <Pressable onPress={startOnboarding}>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}> 
                {i18n.t('onboarding.secondaryLink')} →
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View
        style={{
          alignSelf: 'center',
          width: 106,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.homeIndicator,
          marginTop: 18,
        }}
      />
    </View>
  );
}
