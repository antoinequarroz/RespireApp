import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';

interface SavingsSectionProps {
  amount: string;
  equivalentLabel: string;
  equivalentEmoji: string;
}

export function SavingsSection({
  amount,
  equivalentLabel,
  equivalentEmoji,
}: SavingsSectionProps) {
  return (
    <Card className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {i18n.t('home.moneySaved')}
        </Text>
        <Badge label={i18n.t('home.equivalent')} tone="accent" />
      </View>
      <Text className="text-3xl font-bold text-accent">{amount}</Text>
      <Text className="text-base text-ink dark:text-white">
        {equivalentEmoji} {equivalentLabel}
      </Text>
    </Card>
  );
}
