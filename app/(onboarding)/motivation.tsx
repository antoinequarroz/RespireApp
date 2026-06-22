import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function MotivationScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const motivations = onboardingDraft?.motivations ?? profile?.motivations ?? [];
  const options = [
    i18n.t('onboarding.motivationHealth'),
    i18n.t('onboarding.motivationMoney'),
    i18n.t('onboarding.motivationSport'),
    i18n.t('onboarding.motivationFamily'),
    i18n.t('onboarding.motivationFreedom'),
    i18n.t('onboarding.motivationOther'),
  ];

  return (
    <OnboardingScaffold
      step={4}
      total={4}
      title={i18n.t('onboarding.motivationTitle')}
      subtitle={i18n.t('onboarding.motivationBody')}
      onBack={() => router.back()}
      footer={
        <>
          <Button label={i18n.t('onboarding.finishCta')} onPress={() => router.push('/notifications')} />
          <Pressable onPress={() => router.push('/notifications')}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13, textAlign: 'center' }]}>
              {i18n.t('onboarding.skipMotivation')}
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
        {options.map((option) => {
          const active = motivations.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() =>
                updateOnboardingDraft({
                  motivations: active
                    ? motivations.filter((item) => item !== option)
                    : [...motivations, option],
                })
              }
              style={{
                width: '47%',
                minHeight: 54,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: active ? colors.accent : colors.bgCardBorder,
                backgroundColor: active ? colors.accent : isDark ? colors.bgSurface : colors.bgSurface,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={[
                  FONTS.bold,
                  {
                    color: active ? colors.bgDeep : colors.textPrimary,
                    fontSize: 13,
                    textAlign: 'center',
                  },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}
