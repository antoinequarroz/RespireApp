import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ReadyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const { moneySavedFormatted } = useSavings();

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
      <View style={{ gap: SPACING.xl }}>
        <AppLogo size="header" />
        <View style={{ gap: SPACING.sm }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('onboarding.readyTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('onboarding.readyBody')}
          </Text>
        </View>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9 }]}>
              Cigarettes / jour
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 15 }]}>
              {profile?.cigarettesPerDay}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9 }]}>
              Economies
            </Text>
            <Text style={[FONTS.black, { color: colors.emerald, fontSize: 15 }]}>
              {moneySavedFormatted}
            </Text>
          </View>
        </Card>
      </View>

      <Button
        label={i18n.t('onboarding.start')}
        onPress={() => {
          completeOnboarding();
          router.replace('/');
        }}
      />
    </View>
  );
}
