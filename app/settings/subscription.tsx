import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { openSubscriptionManagement, restoreRevenueCatPurchases } from '@/services/revenuecat';
import { usePremiumStore } from '@/store/premiumStore';

export default function SettingsSubscriptionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const isPremium = usePremiumStore((state) => state.isPremium);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.subscription')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.subscriptionBody')}
        </Text>
      </View>

      <Card
        style={{
          backgroundColor: isPremium ? colors.accentBg : colors.bgCard,
          borderColor: isPremium ? colors.accentBorder : colors.bgCardBorder,
          borderWidth: isPremium ? 1 : 0.5,
          gap: 10,
        }}
      >
        <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.5 }]}>
          {i18n.t('settingsScreen.planStatus')}
        </Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {isPremium ? i18n.t('common.premium') : i18n.t('common.free')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {isPremium ? i18n.t('settingsScreen.premiumActive') : i18n.t('settingsScreen.freeActive')}
        </Text>
      </Card>

      {!isPremium ? (
        <Button label={i18n.t('settingsScreen.goPremium')} onPress={() => router.push('/paywall')} />
      ) : (
        <Button
          label={i18n.t('settingsScreen.manageSubscription')}
          onPress={() => openSubscriptionManagement().catch(() => undefined)}
        />
      )}

      <Button
        label={i18n.t('paywall.restore')}
        variant="secondary"
        onPress={() => restoreRevenueCatPurchases().catch(() => undefined)}
      />
    </ScrollView>
  );
}
