import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.xl }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('paywall.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('paywall.subtitle')}
        </Text>
      </View>

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
        }}
      >
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
          Pourquoi passer premium
        </Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 8 }]}>
          Tenir plus longtemps, avec plus de recul.
        </Text>
        <View style={{ gap: 10, marginTop: 14 }}>
          {[
            'Journal quotidien pour voir les jours qui glissent.',
            'Tendances humeur / envies pour sentir une vraie progression.',
            'Rappels plus engages pour eviter les rechutes passives.',
          ].map((item) => (
            <Text key={item} style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
              • {item}
            </Text>
          ))}
        </View>
      </Card>

      {packages.map((item, index) => {
        const highlighted = index === 1;

        return (
          <View key={item.identifier}>
            <Card
              style={{
                borderColor: highlighted ? colors.accent : colors.bgCardBorder,
                borderWidth: highlighted ? 1 : 0.5,
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
                {highlighted
                  ? 'Moins cher qu un paquet par mois, avec le suivi complet.'
                  : 'Le bon point d entree pour tester le mode premium.'}
              </Text>

              <Button
                label={busy ? i18n.t('common.loading') : 'Choisir ce plan'}
                style={{ marginTop: 18 }}
                onPress={() => buy(item.identifier)}
              />
            </Card>
          </View>
        );
      })}

      <Card>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          Gratuit vs Premium
        </Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            Gratuit: compteur, economies, milestones
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            Premium: journal, heatmap, tendances, meilleur suivi
          </Text>
        </View>
      </Card>

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
    </ScrollView>
  );
}
