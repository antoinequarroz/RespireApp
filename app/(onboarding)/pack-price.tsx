import { useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
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
  const cigarettesPerDay = onboardingDraft?.cigarettesPerDay ?? profile?.cigarettesPerDay ?? 10;
  const packPrice = onboardingDraft?.packPrice ?? profile?.packPrice ?? 11.5;
  const monthlySavings = (packPrice / 20) * cigarettesPerDay * 30;

  return (
    <OnboardingScaffold
      step={3}
      total={4}
      title={i18n.t('onboarding.packPriceTitle')}
      subtitle={i18n.t('onboarding.packPriceBody')}
      onBack={() => router.back()}
      footer={
        <Button
          label={i18n.t('common.continue')}
          disabled={packPrice <= 0}
          onPress={() => router.push('/motivation')}
        />
      }
    >
      <View style={{ gap: SPACING.md }}>
        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            backgroundColor: colors.bgSurface,
            paddingHorizontal: 14,
            paddingVertical: 14,
            gap: 10,
          }}
        >
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              },
            ]}
          >
            {i18n.t('onboarding.packPrice')}
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            value={String(packPrice).replace('.', ',')}
            onChangeText={(value) => updateOnboardingDraft({ packPrice: Number(value.replace(',', '.')) || 0 })}
            style={[
              FONTS.bold,
              {
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.bgCard,
                color: colors.textPrimary,
                fontSize: 16,
                paddingHorizontal: 12,
                paddingVertical: 10,
              },
            ]}
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
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: 1,
              },
            ]}
          >
            {i18n.t('onboarding.potentialSavings')}
          </Text>
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 22, marginTop: 6 }]}>
            {formatCurrency(monthlySavings)}
          </Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}
