import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="pt-8 text-3xl font-bold text-ink dark:text-white">
        {i18n.t('paywall.title')}
      </Text>
      <Text className="text-base text-zinc-600 dark:text-zinc-300">{i18n.t('paywall.subtitle')}</Text>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">{i18n.t('common.free')}</Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">{i18n.t('paywall.freeFeatures')}</Text>
      </Card>
      <Card className="gap-3 border border-primary">
        <Badge label={i18n.t('paywall.yearlyBadge')} tone="accent" />
        <Text className="text-lg font-semibold text-ink dark:text-white">{i18n.t('common.premium')}</Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">{i18n.t('paywall.premiumFeatures')}</Text>
      </Card>
      {(offerings.length > 0
        ? offerings
        : [
            { identifier: '$rc_monthly', title: i18n.t('paywall.monthly'), priceString: i18n.t('paywall.monthly') },
            { identifier: '$rc_annual', title: i18n.t('paywall.yearly'), priceString: i18n.t('paywall.yearly') },
          ]
      ).map((item) => (
        <Card key={item.identifier} className="gap-3">
          <Text className="text-xl font-semibold text-ink dark:text-white">{item.title}</Text>
          <Text className="text-base text-accent">{item.priceString}</Text>
          <Button label={busy ? i18n.t('common.loading') : i18n.t('common.continue')} onPress={() => buy(item.identifier)} />
        </Card>
      ))}
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
