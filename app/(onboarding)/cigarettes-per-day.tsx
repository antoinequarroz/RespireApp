import Slider from '@react-native-community/slider';
import { type Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { getProductConfig } from '@/constants/productConfig';
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
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const productType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const quantity = onboardingDraft?.cigarettesPerDay ?? profile?.cigarettesPerDay ?? productConfig.defaultQuantity;
  const cadenceLabel = productConfig.quantityCadence === 'week' ? 'semaine' : 'jour';

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
      footer={
        <Button
          label={i18n.t('common.continue')}
          onPress={() => router.push('/(onboarding)/pack-price' as Href)}
        />
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 52, letterSpacing: -1.5 }]}>
            {quantity}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            {i18n.t(`products.${productType}.quantityTitle`)} / {cadenceLabel}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11 }]}>
            {i18n.t(`products.${productType}.hint`, {
              value: (quantity / productConfig.unitsPerPrice).toFixed(1).replace('.', ','),
            })}
          </Text>
        </View>

        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            paddingHorizontal: 14,
            paddingVertical: 16,
            gap: 14,
          }}
        >
          <Slider
            minimumValue={productConfig.min}
            maximumValue={productConfig.max}
            step={1}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.dividerStrong}
            thumbTintColor="#7C3AED"
            value={quantity}
            onValueChange={(value) => updateOnboardingDraft({ cigarettesPerDay: Math.round(value) })}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              onPress={() =>
                updateOnboardingDraft({ cigarettesPerDay: Math.max(quantity - 1, productConfig.min) })
              }
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.accent, fontSize: 18 }]}>−</Text>
            </Pressable>

            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
              {quantity} / {cadenceLabel}
            </Text>

            <Pressable
              onPress={() =>
                updateOnboardingDraft({ cigarettesPerDay: Math.min(quantity + 1, productConfig.max) })
              }
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgCard,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.accent, fontSize: 18 }]}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: SPACING.sm }}>
          {PRESETS.map((preset) => {
            const selected =
              (preset.key === 'under5' && quantity < 5) ||
              (preset.key === '5to10' && quantity >= 5 && quantity <= 10) ||
              (preset.key === '11to20' && quantity >= 11 && quantity <= 20) ||
              (preset.key === '20plus' && quantity > 20);

            return (
              <Pressable
                key={preset.key}
                onPress={() => updateOnboardingDraft({ cigarettesPerDay: preset.value })}
                style={{
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: selected ? colors.borderSelected : colors.bgCardBorder,
                  backgroundColor: selected ? colors.cardSelected : colors.bgCard,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[selected ? FONTS.bold : FONTS.regular, { color: selected ? colors.accent : colors.textPrimary, fontSize: 13 }]}>
                    {i18n.t(preset.titleKey)}
                  </Text>
                  <Text style={[FONTS.regular, { color: selected ? colors.emerald : colors.textMuted, fontSize: 10, marginTop: 4 }]}>
                    {i18n.t(preset.subtitleKey)}
                  </Text>
                </View>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: RADII.full,
                    borderWidth: 1,
                    borderColor: selected ? colors.borderSelected : colors.accentBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selected ? (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: RADII.full,
                        backgroundColor: colors.accent,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingScaffold>
  );
}
