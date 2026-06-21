import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';

interface MilestonesSectionProps {
  nextLabel: string;
  progress: number;
}

export function MilestonesSection({ nextLabel, progress }: MilestonesSectionProps) {
  return (
    <Card className="gap-3">
      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {i18n.t('home.nextMilestone')}
      </Text>
      <Text className="text-xl font-semibold text-ink dark:text-white">{nextLabel}</Text>
      <View className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <View
          className="h-2 rounded-full bg-primary"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </View>
    </Card>
  );
}
