import { useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function PackPriceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const productType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const cigarettesPerDay = onboardingDraft?.cigarettesPerDay ?? profile?.cigarettesPerDay ?? 10;
  const packPrice = onboardingDraft?.packPrice ?? profile?.packPrice ?? 11.5;
  const dailyUsage =
    productConfig.quantityCadence === 'day' ? cigarettesPerDay : cigarettesPerDay / 7;
  const monthlySavings = (dailyUsage / productConfig.unitsPerPrice) * packPrice * 30.44;

  return (
    <OnboardingScaffold
      step={4}
      total={5}
      title={i18n.t('onboarding.packPriceTitle', {
        label: i18n.t(`products.${productType}.priceLabel`),
      })}
      subtitle={i18n.t('onboarding.packPriceBody', {
        label: i18n.t(`products.${productType}.priceBody`),
      })}
      onBack={() => router.back()}
      footer={
        <Button
          label={i18n.t('common.continue')}
          disabled={packPrice <= 0}
          onPress={() => router.push('/motivation')}
        />
      }
    >
      <View style={{ gap: SPACING.lg }}>
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 52 }]}>{Math.floor(packPrice)}</Text>
            <Text style={[FONTS.black, { color: colors.textMuted, fontSize: 32 }]}>
              ,{String(Math.round((packPrice % 1) * 100)).padStart(2, '0')}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 16, marginBottom: 8 }]}>
              euros
            </Text>
          </View>

          <TextInput
            keyboardType="decimal-pad"
            value={String(packPrice).replace('.', ',')}
            onChangeText={(value) =>
              updateOnboardingDraft({ packPrice: Number(value.replace(',', '.')) || 0 })
            }
            style={[
              FONTS.bold,
              {
                width: '100%',
                textAlign: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.bgCard,
                color: colors.textPrimary,
                fontSize: 13,
                paddingHorizontal: 12,
                paddingVertical: 10,
              },
            ]}
            placeholder={String(productConfig.defaultPrice).replace('.', ',')}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.emeraldBorder,
            backgroundColor: colors.emeraldBg,
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}
        >
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.emerald,
                fontSize: 8,
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: 1,
              },
            ]}
          >
            {i18n.t('onboarding.potentialSavings')}
          </Text>
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 24, marginTop: 6 }]}>
            {formatCurrency(monthlySavings)} / mois
          </Text>
          <Text style={[FONTS.regular, { color: colors.emerald, fontSize: 11, opacity: 0.7, marginTop: 4 }]}>
            = {formatCurrency(monthlySavings * 12)} par an
          </Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}
