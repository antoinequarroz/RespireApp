import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ReadyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const { moneySavedFormatted } = useSavings();
  const counter = useCounter();
  const cigarettesAvoided = getAvoidedCigarettes(profile?.lastCigaretteAt, profile?.cigarettesPerDay);

  const stats = [
    { value: moneySavedFormatted, label: i18n.t('onboarding.readyStatSavings') },
    { value: String(cigarettesAvoided), label: i18n.t('onboarding.readyStatAvoided') },
    { value: `+${counter.days}j`, label: i18n.t('onboarding.readyStatTime') },
  ];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.emerald,
            backgroundColor: colors.emeraldBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 28 }]}>✓</Text>
        </View>

        <View style={{ marginTop: SPACING.xl, alignItems: 'center', gap: 8 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, textAlign: 'center' }]}>
            {i18n.t('onboarding.readyHeroTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, textAlign: 'center' }]}>
            {i18n.t('onboarding.readyHeroBody')}
          </Text>
        </View>
      </View>

      <View style={{ gap: SPACING.md }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            {stats.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[FONTS.black, { color: colors.accent, fontSize: 18 }]} numberOfLines={1}>
                  {item.value}
                </Text>
                <Text
                  style={[
                    FONTS.regular,
                    { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: 4 },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label={i18n.t('onboarding.start')}
          onPress={() => {
            completeOnboarding();
            router.replace('/');
          }}
        />

        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
          {profile?.cigarettesPerDay} {i18n.t('onboarding.cigarettesUnit')} • {profile?.packPrice} EUR
        </Text>
      </View>
    </View>
  );
}
