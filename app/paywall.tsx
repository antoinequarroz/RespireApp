import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
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
          {
            identifier: '$rc_monthly',
            title: 'Mensuel',
            priceString: i18n.t('paywall.monthly'),
          },
          {
            identifier: '$rc_annual',
            title: 'Annuel',
            priceString: i18n.t('paywall.yearly'),
          },
        ];

  const selectedPackage =
    packages.find((item) => item.identifier === selectedIdentifier) ??
    packages.find((item) => item.identifier === '$rc_annual') ??
    packages[0];

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

  const premiumFeatures = [
    'Journal emotionnel',
    'Stats avancees & widget',
    'Heatmap tendances 30j',
  ];

  const compareRows = [
    ['Compteur', 'Inclus', 'Inclus'],
    ['Economies', 'Inclus', 'Inclus'],
    ['Mode SOS', 'Inclus', 'Inclus'],
    ['Journal', 'Limite', 'Inclus'],
    ['Stats avancees', 'Simple', 'Avance'],
    ['Widget', 'Limite', 'Inclus'],
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, gap: 6 }}>
          <AppLogo size="header" />
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
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
            backgroundColor: colors.bgSurface,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Card style={{ gap: 12, backgroundColor: colors.bgSurface }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('paywall.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('paywall.compareBody')}
        </Text>

        {compareRows.map(([label, free, premium], index) => (
          <View
            key={label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: index === 0 ? 0 : 10,
              borderTopWidth: index === 0 ? 0 : 0.5,
              borderTopColor: colors.divider,
            }}
          >
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, flex: 1 }]}>{label}</Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 10, width: 58, textAlign: 'center' }]}>
              {free}
            </Text>
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 10, width: 76, textAlign: 'center' }]}>
              {premium}
            </Text>
          </View>
        ))}
      </Card>

      {packages.map((item) => {
        const annual = item.identifier === '$rc_annual';
        const selected = (selectedIdentifier ?? selectedPackage?.identifier) === item.identifier;

        return (
          <Pressable key={item.identifier} onPress={() => setSelectedIdentifier(item.identifier)}>
            <Card
              style={{
                position: 'relative',
                backgroundColor: annual ? colors.accentBg : colors.bgSurface,
                borderColor: annual ? colors.accent : colors.bgCardBorder,
                borderWidth: annual ? 1 : 0.5,
                paddingTop: annual ? 20 : 16,
              }}
            >
              {annual ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: 10,
                    borderRadius: RADII.full,
                    backgroundColor: fixed.purple,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 8 }]}>
                    {i18n.t('paywall.recommended')}
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
                  <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, marginTop: 8 }]}>
                    {annual ? i18n.t('paywall.yearlyBody') : i18n.t('paywall.monthlyPitch')}
                  </Text>
                  {annual ? (
                    <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11, marginTop: 8 }]}>
                      {i18n.t('paywall.yearlyPerMonth')}
                    </Text>
                  ) : null}
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
        );
      })}

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
          gap: 8,
        }}
      >
        <Text style={[FONTS.bold, { color: colors.accent, fontSize: 10, letterSpacing: 0.8 }]}>AVEC PREMIUM</Text>
        {premiumFeatures.map((item) => (
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
              <Text style={[FONTS.bold, { color: colors.accent, fontSize: 7 }]}>✓</Text>
            </View>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>{item}</Text>
          </View>
        ))}
      </Card>

      <Button
        label={busy ? i18n.t('common.loading') : i18n.t('paywall.ctaSelected', { plan: selectedPackage?.title ?? '' })}
        onPress={() => selectedPackage && buy(selectedPackage.identifier)}
      />

      <Pressable onPress={() => restoreRevenueCatPurchases().then((info) => setPremiumStatus(isPremiumCustomer(info))).catch(() => undefined)}>
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
