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

  const buy = async (identifier: string) => {
    setBusy(true);
    try {
      const offering = await fetchOfferings();
      const selectedPackage = offering?.availablePackages.find((item) => item.identifier === identifier);
      if (!selectedPackage) {
        Alert.alert(i18n.t('app.name'), i18n.t('common.soon'));
        return;
      }
      const customerInfo = await purchasePackage(selectedPackage);
      setPremiumStatus(isPremiumCustomer(customerInfo));
      router.back();
    } finally {
      setBusy(false);
    }
  };

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

  const premiumPoints = [
    i18n.t('paywall.pointJournal'),
    i18n.t('paywall.pointTrends'),
    i18n.t('paywall.pointReminders'),
  ];

  const featureRows = [
    {
      label: i18n.t('home.hero'),
      free: i18n.t('paywall.included'),
      premium: i18n.t('paywall.included'),
    },
    {
      label: i18n.t('home.moneySaved'),
      free: i18n.t('paywall.included'),
      premium: i18n.t('paywall.included'),
    },
    {
      label: i18n.t('common.sos'),
      free: i18n.t('paywall.included'),
      premium: i18n.t('paywall.included'),
    },
    {
      label: i18n.t('journalScreen.title'),
      free: i18n.t('paywall.locked'),
      premium: i18n.t('paywall.included'),
    },
    {
      label: i18n.t('statsScreen.badgesTitle'),
      free: i18n.t('paywall.basic'),
      premium: i18n.t('paywall.advanced'),
    },
    {
      label: i18n.t('paywall.widgetLabel'),
      free: i18n.t('paywall.locked'),
      premium: i18n.t('paywall.included'),
    },
  ];

  const selectedPackage =
    packages.find((item) => item.identifier === selectedIdentifier) ??
    packages.find((item) => item.identifier === '$rc_annual') ??
    packages[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View
        style={{
          gap: SPACING.sm,
          paddingTop: SPACING.xl,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, gap: SPACING.sm }}>
          <AppLogo size="header" />
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('paywall.title')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('paywall.subtitle')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 18 }]}>×</Text>
        </Pressable>
      </View>

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
          gap: SPACING.md,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <Text
              style={[
                FONTS.bold,
                {
                  color: colors.accent,
                  fontSize: 8,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {i18n.t('paywall.whyPremium')}
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20 }]}>
              {i18n.t('paywall.heroTitle')}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
              {i18n.t('paywall.heroBody')}
            </Text>
          </View>
          <View
            style={{
              marginLeft: SPACING.md,
              borderRadius: RADII.full,
              borderWidth: 1,
              borderColor: colors.emeraldBorder,
              backgroundColor: colors.emeraldBg,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text
              style={[
                FONTS.bold,
                {
                  color: colors.emerald,
                  fontSize: 8,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {i18n.t('paywall.priceAnchorLabel')}
            </Text>
            <Text style={[FONTS.black, { color: colors.emerald, fontSize: 18 }]}>
              {i18n.t('paywall.priceAnchorValue')}
            </Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          {premiumPoints.map((item) => (
            <View key={item} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View
                style={{
                  marginTop: 2,
                  width: 18,
                  height: 18,
                  borderRadius: RADII.full,
                  backgroundColor: colors.bgCard,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={[FONTS.black, { color: colors.accent, fontSize: 9 }]}>+</Text>
              </View>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, flex: 1 }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { value: i18n.t('paywall.metricValueOne'), label: i18n.t('paywall.metricLabelOne') },
            { value: i18n.t('paywall.metricValueTwo'), label: i18n.t('paywall.metricLabelTwo') },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: colors.bgCard,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>{item.value}</Text>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {packages.map((item, index) => {
        const highlighted = index === 1;
        const selected = (selectedIdentifier ?? selectedPackage?.identifier) === item.identifier;

        return (
          <Pressable key={item.identifier} onPress={() => setSelectedIdentifier(item.identifier)}>
            <Card
              style={{
                borderColor: selected || highlighted ? colors.accent : colors.bgCardBorder,
                borderWidth: selected || highlighted ? 1 : 0.5,
                backgroundColor: selected && highlighted ? colors.accentBg : colors.bgCard,
                paddingTop: highlighted ? 18 : 16,
              }}
            >
              {highlighted ? (
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

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
                    {item.title}
                  </Text>
                  <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10, marginTop: 2 }]}>
                    {highlighted ? i18n.t('paywall.bestValueBody') : i18n.t('paywall.monthlyBody')}
                  </Text>
                  <Text
                    style={[
                      FONTS.black,
                      {
                        color: highlighted ? colors.accent : colors.textPrimary,
                        fontSize: 22,
                        marginTop: 6,
                      },
                    ]}
                  >
                    {item.priceString}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: RADII.full,
                    backgroundColor: highlighted ? colors.emeraldBg : colors.bgCard,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={[
                      FONTS.bold,
                      {
                        color: highlighted ? colors.emerald : colors.textSecondary,
                        fontSize: 8,
                      },
                    ]}
                  >
                    {highlighted ? 'Le plus rentable' : 'Flexible'}
                  </Text>
                </View>
              </View>

              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, marginTop: 12 }]}>
                {highlighted ? i18n.t('paywall.yearlyBody') : i18n.t('paywall.monthlyPitch')}
              </Text>

              <View
                style={{
                  marginTop: 18,
                  width: 18,
                  height: 18,
                  borderRadius: RADII.full,
                  borderWidth: 1,
                  borderColor: selected ? colors.accent : colors.accentBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
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
            </Card>
          </Pressable>
        );
      })}

      <Card style={{ gap: SPACING.md }}>
        <View style={{ gap: 4 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('paywall.compareTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('paywall.compareBody')}
          </Text>
        </View>

        {featureRows.map((item) => (
          <View
            key={item.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderTopWidth: 0.5,
              borderTopColor: colors.divider,
              paddingTop: 12,
            }}
          >
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, flex: 1 }]}>
              {item.label}
            </Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 10, width: 64, textAlign: 'center' }]}>
              {item.free}
            </Text>
            <Text
              style={[
                FONTS.black,
                { color: colors.accent, fontSize: 10, width: 84, textAlign: 'center' },
              ]}
            >
              {item.premium}
            </Text>
          </View>
        ))}
      </Card>

      <Button
        label={busy ? i18n.t('common.loading') : i18n.t('paywall.ctaSelected', { plan: selectedPackage?.title ?? '' })}
        onPress={() => selectedPackage && buy(selectedPackage.identifier)}
      />

      <Button
        label={i18n.t('paywall.restore')}
        variant="secondary"
        onPress={async () => {
          const customerInfo = await restoreRevenueCatPurchases();
          setPremiumStatus(isPremiumCustomer(customerInfo));
        }}
      />
      <Button
        label={i18n.t('paywall.manage')}
        variant="ghost"
        onPress={() => openSubscriptionManagement().catch(() => undefined)}
      />
      <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, textAlign: 'center' }]}>
        {i18n.t('paywall.legal')}
      </Text>
    </ScrollView>
  );
}
