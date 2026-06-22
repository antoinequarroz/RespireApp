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
        borderWidth: 1.5,
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
          borderWidth: 2,
          borderColor: colors.accent,
          opacity: 0.55,
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
        productType: 'cigarette',
        lastCigaretteAt: new Date().toISOString(),
        cigarettesPerDay: 10,
        packPrice: 11.5,
        motivations: [],
      },
    );
    router.push('/product-type');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgPrimary,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.lg,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ gap: 28 }}>
          <View style={{ alignItems: 'center', gap: SPACING.lg, marginTop: 24 }}>
            <BrandMark />
            <View style={{ alignItems: 'center', gap: 8 }}>
              <AppLogo size="hero" />
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}>
                {i18n.t('onboarding.logoTagline')}
              </Text>
            </View>
          </View>

          <View style={{ gap: 18 }}>
            <View style={{ gap: 2 }}>
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, lineHeight: 28 }]}>
                {i18n.t('onboarding.landingTitle')}
              </Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, lineHeight: 18 }]}>
                {i18n.t('onboarding.landingBody')}
              </Text>
            </View>

            {[
              {
                title: i18n.t('onboarding.pitchCounter'),
                body: 'Secondes, minutes, jours',
                tone: colors.accentBg,
                border: colors.accentBorder,
                glyph: '◴',
                glyphColor: colors.accent,
              },
              {
                title: i18n.t('onboarding.pitchMoney'),
                body: 'Calcule en temps reel',
                tone: colors.emeraldBg,
                border: colors.emeraldBorder,
                glyph: '€',
                glyphColor: colors.emerald,
              },
              {
                title: i18n.t('onboarding.pitchSos'),
                body: 'Exercice de respiration',
                tone: colors.accentBg,
                border: colors.accentBorder,
                glyph: '∿',
                glyphColor: colors.accent,
              },
            ].map((item) => (
              <View key={item.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    backgroundColor: item.tone,
                    borderWidth: 1,
                    borderColor: item.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={[FONTS.bold, { color: item.glyphColor, fontSize: 12 }]}>{item.glyph}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>{item.title}</Text>
                  <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>{item.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: SPACING.xl }}>
          <Button label={i18n.t('onboarding.startFreeCta')} onPress={startOnboarding} />

          {__DEV__ ? (
            <Button
              label={i18n.t('onboarding.devSkip')}
              variant="ghost"
              onPress={() => {
                const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
                setProfile({
                  productType: 'cigarette',
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
                {i18n.t('onboarding.secondaryLink')} {'→'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View
        style={{
          alignSelf: 'center',
          width: 104,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.homeIndicator,
          marginTop: SPACING.lg,
        }}
      />
    </View>
  );
}
