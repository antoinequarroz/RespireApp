import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { getProductConfig, PRODUCT_TYPES } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ProductTypeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const selectedType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';

  return (
    <OnboardingScaffold
      step={1}
      total={5}
      title={i18n.t('onboarding.productTypeTitle')}
      subtitle={i18n.t('onboarding.productTypeBody')}
      onBack={() => router.back()}
      footer={<Button label={i18n.t('common.continue')} onPress={() => router.push('/last-cigarette')} />}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
        {PRODUCT_TYPES.map((productType) => {
          const active = selectedType === productType;
          const config = getProductConfig(productType);

          return (
            <Pressable
              key={productType}
              onPress={() =>
                updateOnboardingDraft({
                  productType,
                  cigarettesPerDay: getProductConfig(productType).defaultQuantity,
                  packPrice: getProductConfig(productType).defaultPrice,
                })
              }
              style={{
                width: '47%',
                minHeight: 92,
                borderRadius: 13,
                borderWidth: 1,
                borderColor: active ? colors.borderSelected : colors.bgCardBorder,
                backgroundColor: active ? colors.cardSelected : colors.bgCard,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
              <Text
                style={[
                  FONTS.bold,
                  {
                    color: active ? colors.accent : colors.textPrimary,
                    fontSize: 12,
                    textAlign: 'center',
                  },
                ]}
              >
                {i18n.t(`products.${productType}.title`)}
              </Text>
              <View
                style={{
                  borderRadius: RADII.full,
                  backgroundColor: colors.accentBg,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={[FONTS.bold, { color: colors.accent, fontSize: 8 }]}>
                  {i18n.t(`products.${productType}.unitShort`)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}
