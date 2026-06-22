import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingOptionCard, OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

const PRESETS = [
  { key: 'under5', value: 4, titleKey: 'onboarding.cigarettesOptionOne', subtitleKey: 'onboarding.cigarettesSaveOne' },
  { key: '5to10', value: 8, titleKey: 'onboarding.cigarettesOptionTwo', subtitleKey: 'onboarding.cigarettesSaveTwo' },
  { key: '11to20', value: 15, titleKey: 'onboarding.cigarettesOptionThree', subtitleKey: 'onboarding.cigarettesSaveThree' },
  { key: '20plus', value: 25, titleKey: 'onboarding.cigarettesOptionFour', subtitleKey: 'onboarding.cigarettesSaveFour' },
] as const;

export default function CigarettesPerDayScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const cigarettesPerDay = onboardingDraft?.cigarettesPerDay ?? profile?.cigarettesPerDay ?? 10;
  const selectedPreset = useMemo(
    () =>
      PRESETS.find((preset) => {
        if (preset.key === 'under5') return cigarettesPerDay < 5;
        if (preset.key === '5to10') return cigarettesPerDay >= 5 && cigarettesPerDay <= 10;
        if (preset.key === '11to20') return cigarettesPerDay >= 11 && cigarettesPerDay <= 20;
        return cigarettesPerDay > 20;
      })?.key,
    [cigarettesPerDay],
  );

  return (
    <OnboardingScaffold
      step={2}
      total={4}
      title={i18n.t('onboarding.cigarettesPerDayTitle')}
      subtitle={i18n.t('onboarding.cigarettesPerDayBody')}
      onBack={() => router.back()}
      footer={<Button label={i18n.t('common.continue')} onPress={() => router.push('/pack-price')} />}
    >
      <View style={{ gap: SPACING.sm }}>
        {PRESETS.map((preset) => (
          <OnboardingOptionCard
            key={preset.key}
            title={i18n.t(preset.titleKey)}
            subtitle={i18n.t(preset.subtitleKey)}
            selected={selectedPreset === preset.key}
            onPress={() => updateOnboardingDraft({ cigarettesPerDay: preset.value })}
          />
        ))}

        <View
          style={{
            marginTop: SPACING.sm,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgSurface,
            paddingHorizontal: 14,
            paddingVertical: 14,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
              {i18n.t('onboarding.customQuantity')}
            </Text>
            <View
              style={{
                borderRadius: RADII.full,
                backgroundColor: colors.accentBg,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.accentSoft, fontSize: 11 }]}>
                {cigarettesPerDay} {i18n.t('onboarding.cigarettesUnit')}
              </Text>
            </View>
          </View>

          <Slider
            minimumValue={1}
            maximumValue={60}
            step={1}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.dividerStrong}
            value={cigarettesPerDay}
            onValueChange={(value) => updateOnboardingDraft({ cigarettesPerDay: Math.round(value) })}
          />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => updateOnboardingDraft({ cigarettesPerDay: Math.max(cigarettesPerDay - 1, 1) })}
              style={{
                flex: 1,
                minHeight: 40,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 16 }]}>-</Text>
            </Pressable>
            <Pressable
              onPress={() => updateOnboardingDraft({ cigarettesPerDay: Math.min(cigarettesPerDay + 1, 60) })}
              style={{
                flex: 1,
                minHeight: 40,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 16 }]}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </OnboardingScaffold>
  );
}
