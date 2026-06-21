import { Text, View } from 'react-native';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';

interface CounterSectionProps {
  value: string;
}

export function CounterSection({ value }: CounterSectionProps) {
  return (
    <Card className="gap-3">
      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {i18n.t('home.hero')}
      </Text>
      <View>
        <AnimatedCounter
          value={value}
          className="text-4xl font-bold text-ink dark:text-white"
        />
      </View>
    </Card>
  );
}
