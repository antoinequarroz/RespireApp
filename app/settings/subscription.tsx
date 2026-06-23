import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
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
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SettingsScreenHeader
        title={i18n.t('settingsScreen.subscription')}
        subtitle={i18n.t('settingsScreen.subscriptionBody')}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.xxl,
          gap: SPACING.lg,
        }}
      >

      <Card style={{ backgroundColor: colors.bgCard, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12 }]}>
            {i18n.t('settingsScreen.planStatus')}
          </Text>
          <View
            style={{
              backgroundColor: colors.accentBg,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 8 }]}>
              {isPremium ? i18n.t('common.premium').toUpperCase() : i18n.t('common.free').toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, lineHeight: 14 }]}>
          {isPremium ? i18n.t('settingsScreen.premiumActive') : i18n.t('settingsScreen.freeFeaturesInline')}
        </Text>
      </Card>

      {!isPremium ? (
        <Card
          style={{
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
            borderWidth: 1,
            gap: 8,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.accent, fontSize: 10, letterSpacing: 0.8 }]}>
            {i18n.t('settingsScreen.withPremium')}
          </Text>
          {[
            i18n.t('settingsScreen.premiumLineOne'),
            i18n.t('settingsScreen.premiumLineTwo'),
            i18n.t('settingsScreen.premiumLineThree'),
          ].map((item) => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.accentBg,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={[FONTS.bold, { color: colors.accent, fontSize: 8 }]}>+</Text>
              </View>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>{item}</Text>
            </View>
          ))}
        </Card>
      ) : null}

      {!isPremium ? (
        <Button label={i18n.t('settingsScreen.goPremium')} onPress={() => router.push('/paywall')} />
      ) : (
        <Button
          label={i18n.t('settingsScreen.manageSubscription')}
          onPress={() => openSubscriptionManagement().catch(() => undefined)}
        />
      )}

      <Pressable onPress={() => restoreRevenueCatPurchases().catch(() => undefined)}>
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
          {i18n.t('paywall.restore')}
        </Text>
      </Pressable>
      </ScrollView>
    </View>
  );
}
