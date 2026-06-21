import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { i18n } from '@/services/i18n';

interface HealthSectionProps {
  progress: number;
  nextLabel: string;
  completed: number;
}

export function HealthSection({ progress, nextLabel, completed }: HealthSectionProps) {
  return (
    <Card className="flex-row items-center justify-between">
      <View className="max-w-[56%] gap-2">
        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {i18n.t('home.healthTeaser')}
        </Text>
        <Text className="text-lg font-semibold text-ink dark:text-white">{nextLabel}</Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">{completed}</Text>
      </View>
      <ProgressRing progress={progress} label="" value={`${completed}`} size={100} />
    </Card>
  );
}
