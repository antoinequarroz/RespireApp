import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingOptionCard, OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, SPACING } from '@/constants/theme';
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
  const productType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
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
      step={3}
      total={5}
      title={i18n.t('onboarding.cigarettesPerDayTitle', {
        unit: i18n.t(`products.${productType}.quantityTitle`),
      })}
      subtitle={i18n.t('onboarding.cigarettesPerDayBody', {
        unit: i18n.t(`products.${productType}.quantityBody`),
      })}
      onBack={() => router.back()}
      footer={<Button label={i18n.t('common.continue')} onPress={() => router.push('/pack-price')} />}
    >
      <View style={{ gap: SPACING.lg }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 48, letterSpacing: -1.5 }]}>
            {cigarettesPerDay}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            {i18n.t(`products.${productType}.unitLong`)}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11 }]}>
            {i18n.t(`products.${productType}.hint`, { value: cigarettesPerDay.toFixed(1) })}
          </Text>
        </View>

        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            paddingHorizontal: 14,
            paddingVertical: 14,
            gap: 12,
          }}
        >
          <Slider
            minimumValue={1}
            maximumValue={productConfig.max}
            step={1}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.dividerStrong}
            value={cigarettesPerDay}
            onValueChange={(value) => updateOnboardingDraft({ cigarettesPerDay: Math.round(value) })}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={() => updateOnboardingDraft({ cigarettesPerDay: Math.max(cigarettesPerDay - 1, 1) })}
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.regular, { color: colors.accent, fontSize: 20 }]}>−</Text>
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => updateOnboardingDraft({ cigarettesPerDay: Math.min(cigarettesPerDay + 1, 60) })}
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.regular, { color: colors.accent, fontSize: 20 }]}>+</Text>
            </Pressable>
          </View>
        </View>

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
        </View>
      </View>
    </OnboardingScaffold>
  );
}
