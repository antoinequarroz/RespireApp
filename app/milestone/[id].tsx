import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MILESTONES } from '@/constants/milestones';
import { i18n } from '@/services/i18n';

export default function MilestoneScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const milestone = MILESTONES.find((item) => item.id === id) ?? MILESTONES[0];

  return (
    <View className="flex-1 justify-center bg-white px-6 dark:bg-night">
      <Card className="items-center gap-4">
        <Text className="text-2xl font-bold text-ink dark:text-white">{milestone.labelFr}</Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">
          {i18n.t('milestone.share')}
        </Text>
        <Button label={i18n.t('milestone.cta')} onPress={() => router.back()} />
      </Card>
    </View>
  );
}
