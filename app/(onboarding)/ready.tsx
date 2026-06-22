import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ReadyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const setProfile = useUserStore((state) => state.setProfile);
  const clearOnboardingDraft = useUserStore((state) => state.clearOnboardingDraft);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const counter = useCounter();

  const profile = {
    productType: onboardingDraft?.productType ?? 'cigarette',
    lastCigaretteAt: onboardingDraft?.lastCigaretteAt ?? new Date().toISOString(),
    cigarettesPerDay: onboardingDraft?.cigarettesPerDay ?? 10,
    packPrice: onboardingDraft?.packPrice ?? 11.5,
    motivations: onboardingDraft?.motivations ?? [],
  };
  const cigarettesAvoided = getAvoidedCigarettes(profile.lastCigaretteAt, profile.cigarettesPerDay);
  const moneySaved = formatCurrency((cigarettesAvoided / 20) * profile.packPrice);
  const totalSmokeFreeDays = Math.max(counter.days, 0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.lg,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.xl }}>
        <Text style={{ fontSize: 20, opacity: 0.85 }}>✦ ✦ ✦</Text>

        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: RADII.full,
            borderWidth: 2,
            borderColor: colors.emerald,
            backgroundColor: colors.emeraldBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 32 }]}>✓</Text>
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 17, textAlign: 'center' }]}>
            {i18n.t('onboarding.readyStartNow')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, textAlign: 'center' }]}>
            {i18n.t('onboarding.readyHeroBody')}
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 18,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            paddingHorizontal: 12,
            paddingVertical: 14,
            flexDirection: 'row',
          }}
        >
          {[
            { value: moneySaved, label: i18n.t('onboarding.readyStatSavings') },
            { value: String(cigarettesAvoided), label: i18n.t('onboarding.readyStatAvoided') },
            { value: `+${totalSmokeFreeDays}j`, label: i18n.t('onboarding.readyStatTime') },
          ].map((item, index) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingHorizontal: 6,
                borderLeftWidth: index === 0 ? 0 : 0.5,
                borderLeftColor: colors.divider,
              }}
            >
              <Text
                style={[
                  FONTS.black,
                  {
                    color: index === 0 ? colors.emerald : index === 1 ? colors.accent : colors.textPrimary,
                    fontSize: 16,
                  },
                ]}
              >
                {item.value}
              </Text>
              <Text
                style={[
                  FONTS.regular,
                  {
                    color: colors.textMuted,
                    fontSize: 9,
                    marginTop: 4,
                    textAlign: 'center',
                  },
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: SPACING.md }}>
        <Button
          label={i18n.t('onboarding.start')}
          onPress={() => {
            setProfile(profile);
            clearOnboardingDraft();
            completeOnboarding();
            router.replace('/(tabs)');
          }}
        />
        <Pressable onPress={() => router.push('/last-cigarette')}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13, textAlign: 'center' }]}>
            {i18n.t('onboarding.editData')}
          </Text>
        </Pressable>
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
