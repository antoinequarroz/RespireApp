import { useRouter } from 'expo-router';
import { Check, Sparkles, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import {
  fetchOfferings,
  isPremiumCustomer,
  openSubscriptionManagement,
  purchasePackage,
  restoreRevenueCatPurchases,
} from '@/services/revenuecat';
import { usePremiumStore } from '@/store/premiumStore';

export default function PaywallScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const setPremiumStatus = usePremiumStore((state) => state.setPremiumStatus);
  const setOfferings = usePremiumStore((state) => state.setOfferings);
  const offerings = usePremiumStore((state) => state.offerings);
  const [busy, setBusy] = useState(false);
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(null);

  useEffect(() => {
    fetchOfferings()
      .then((offering) => {
        const packages = offering?.availablePackages ?? [];
        setOfferings(
          packages.map((item) => ({
            identifier: item.identifier,
            title: item.product.title,
            priceString: item.product.priceString,
          })),
        );
      })
      .catch(() => undefined);
  }, [setOfferings]);

  const packages =
    offerings.length > 0
      ? offerings
      : [
          { identifier: '$rc_monthly', title: 'Mensuel', priceString: i18n.t('paywall.monthly') },
          { identifier: '$rc_annual', title: 'Annuel', priceString: i18n.t('paywall.yearly') },
        ];

  const selectedPackage =
    packages.find((item) => item.identifier === selectedIdentifier) ??
    packages.find((item) => item.identifier === '$rc_annual') ??
    packages[0];

  const compareRows: [string, boolean, boolean][] = [
    ['Compteur & SOS', true, true],
    ['Économies & objectifs (1)', true, true],
    ['Stats & graphiques', true, true],
    ['Zone Zen (3 techniques)', true, true],
    ['Journal quotidien', false, true],
    ['Insights & tendances', false, true],
    ['Objectifs cagnotte multiples', false, true],
    ['Wim Hof & catégories notifs', false, true],
    ['Partage de paliers (image)', false, true],
  ];

  const buy = async (identifier: string) => {
    setBusy(true);
    try {
      const offering = await fetchOfferings();
      const selected = offering?.availablePackages.find((item) => item.identifier === identifier);
      if (!selected) {
        Alert.alert(i18n.t('app.name'), i18n.t('common.soon'));
        return;
      }

      const customerInfo = await purchasePackage(selected);
      setPremiumStatus(isPremiumCustomer(customerInfo));
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>
            {i18n.t('paywall.brandTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('paywall.subtitle')}
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <X size={16} color={colors.textSecondary} strokeWidth={1.5} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(320)}>
        <Card style={{ gap: 10, backgroundColor: colors.accentBg, borderColor: colors.accentBorder, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Sparkles color={colors.accent} size={16} strokeWidth={1.5} />
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.1 }]}>
              {i18n.t('paywall.whyPremium')}
            </Text>
          </View>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('paywall.heroTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            {i18n.t('paywall.heroBody')}
          </Text>
        </Card>
      </Animated.View>

      <Card style={{ gap: 10 }}>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12 }]}>
          {i18n.t('paywall.compareTitle')}
        </Text>
        {compareRows.map(([label, free, premium], index) => (
          <View
            key={String(label)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: index === 0 ? 0 : 10,
              borderTopWidth: index === 0 ? 0 : 0.5,
              borderTopColor: colors.divider,
            }}
          >
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, flex: 1 }]}>{label}</Text>
            <View style={{ width: 58, alignItems: 'center' }}>
              {free ? <Check size={14} color={colors.textMuted} strokeWidth={1.5} /> : <Text style={{ color: colors.textMuted }}>—</Text>}
            </View>
            <View style={{ width: 76, alignItems: 'center' }}>
              {premium ? <Check size={14} color={colors.accent} strokeWidth={1.5} /> : <Text style={{ color: colors.textMuted }}>—</Text>}
            </View>
          </View>
        ))}
      </Card>

      {packages.map((item, index) => {
        const annual = item.identifier === '$rc_annual';
        const selected = (selectedIdentifier ?? selectedPackage?.identifier) === item.identifier;

        return (
          <Animated.View key={item.identifier} entering={FadeInDown.delay(140 + index * 80).duration(300)}>
            <Pressable onPress={() => setSelectedIdentifier(item.identifier)}>
              <Card
                style={{
                  position: 'relative',
                  backgroundColor: annual ? 'rgba(124,58,237,0.10)' : colors.bgCard,
                  borderColor: annual ? colors.accent : colors.bgCardBorder,
                  borderWidth: annual ? 1 : 0.5,
                  paddingTop: annual ? 20 : 16,
                }}
              >
                {annual ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: 6,
                      borderRadius: RADII.full,
                      backgroundColor: fixed.purple,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Sparkles color="#FFFFFF" size={8} strokeWidth={1.5} />
                    <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 8 }]}>
                      {i18n.t('paywall.recommended').toUpperCase()}
                    </Text>
                  </View>
                ) : null}

                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>{item.title}</Text>
                    <Text
                      style={[
                        FONTS.black,
                        { color: annual ? colors.accent : colors.textPrimary, fontSize: 22, marginTop: 6 },
                      ]}
                    >
                      {item.priceString}
                    </Text>
                    <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11, marginTop: 8 }]}>
                      {annual ? i18n.t('paywall.yearlyPerMonth') : i18n.t('paywall.monthlyPitch')}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 12,
                      width: 18,
                      height: 18,
                      borderRadius: RADII.full,
                      borderWidth: 1,
                      borderColor: selected ? colors.accent : colors.accentBorder,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 4,
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
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        );
      })}

      <Button
        label={busy ? i18n.t('common.loading') : i18n.t('paywall.ctaSelected', { plan: selectedPackage?.title ?? '' })}
        onPress={() => selectedPackage && buy(selectedPackage.identifier)}
      />

      <Pressable
        onPress={() =>
          restoreRevenueCatPurchases()
            .then((info) => setPremiumStatus(isPremiumCustomer(info)))
            .catch(() => undefined)
        }
      >
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
          {i18n.t('paywall.restore')}
        </Text>
      </Pressable>
      <Pressable onPress={() => openSubscriptionManagement().catch(() => undefined)}>
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, textAlign: 'center' }]}>
          {i18n.t('paywall.legal')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
