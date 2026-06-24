import { type Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function MotivationScreen() {
  const router = useRouter();
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const motivations = onboardingDraft?.motivations ?? profile?.motivations ?? [];
  const options = [
    { key: 'health', label: i18n.t('onboarding.motivationHealth'), emoji: '❤️' },
    { key: 'money', label: i18n.t('onboarding.motivationMoney'), emoji: '💸' },
    { key: 'sport', label: i18n.t('onboarding.motivationSport'), emoji: '🏃' },
    { key: 'family', label: i18n.t('onboarding.motivationFamily'), emoji: '👨‍👩‍👧' },
    { key: 'freedom', label: i18n.t('onboarding.motivationFreedom'), emoji: '🕊️' },
    { key: 'other', label: i18n.t('onboarding.motivationOther'), emoji: '✨' },
  ];

  return (
    <OnboardingScaffold
      step={5}
      total={5}
      title={i18n.t('onboarding.motivationTitle')}
      subtitle={i18n.t('onboarding.motivationBody')}
      onBack={() => router.back()}
      footer={
        <>
          <Button
            label={i18n.t('onboarding.finishCta')}
            onPress={() => router.push('/(onboarding)/notifications' as Href)}
          />
          <Pressable onPress={() => router.push('/(onboarding)/notifications' as Href)}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
              {i18n.t('onboarding.skipMotivation')}
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        <Text
          style={[
            FONTS.regular,
            {
              color: colors.textSecondary,
              fontSize: 11,
              textAlign: 'center',
              maxWidth: 260,
              alignSelf: 'center',
            },
          ]}
        >
          {i18n.t('onboarding.motivationBody')}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'center' }}>
          {options.map((option) => {
            const active = motivations.includes(option.key);

            return (
              <Pressable
                key={option.key}
                onPress={() =>
                  updateOnboardingDraft({
                    motivations: active
                      ? motivations.filter((item) => item !== option.key)
                      : [...motivations, option.key],
                  })
                }
                style={{
                  width: '47%',
                  minHeight: 102,
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: active ? colors.borderSelected : colors.bgCardBorder,
                  backgroundColor: active ? colors.cardSelected : colors.bgCard,
                  paddingHorizontal: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 25 }}>{option.emoji}</Text>
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
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingScaffold>
  );
}
