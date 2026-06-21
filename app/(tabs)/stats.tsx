import { ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { MilestoneCard } from '@/components/domain/MilestoneCard';
import { SavingsEquivalent } from '@/components/domain/SavingsEquivalent';
import { Card } from '@/components/ui/Card';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function buildPath(points: { x: number; y: number }[]) {
  const maxY = Math.max(...points.map((point) => point.y), 1);
  return points
    .map((point, index) => {
      const x = (point.x / (points.length - 1 || 1)) * 300;
      const y = 120 - (point.y / maxY) * 100;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

export default function StatsScreen() {
  const profile = useUserStore((state) => state.profile);
  const savings = useSavings();
  const milestones = useMilestones();
  const health = useHealthStats();
  const avoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay ?? 0,
  );

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="pt-6 text-3xl font-bold text-ink dark:text-white">
        {i18n.t('statsScreen.title')}
      </Text>
      <Card className="gap-4">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('statsScreen.savingsCurve')}
        </Text>
        <Svg width="100%" height={140} viewBox="0 0 300 120">
          <Path d={buildPath(savings.series)} stroke="#1B6CA8" strokeWidth={4} fill="none" />
        </Svg>
      </Card>
      <View className="flex-row gap-4">
        <Card className="flex-1 gap-2">
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {i18n.t('home.avoided')}
          </Text>
          <Text className="text-3xl font-bold text-ink dark:text-white">{avoided}</Text>
        </Card>
        <Card className="flex-1 gap-2">
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {i18n.t('home.moneySaved')}
          </Text>
          <Text className="text-3xl font-bold text-accent">{savings.moneySavedFormatted}</Text>
        </Card>
      </View>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('statsScreen.healthTimeline')}
        </Text>
        {health.timeline.map((item) => (
          <MilestoneCard key={item.key} label={item.labelFr} reached={item.reached} />
        ))}
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('statsScreen.equivalents')}
        </Text>
        <SavingsEquivalent emoji={savings.equivalent.emoji} label={savings.equivalent.labelFr} />
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('home.nextMilestone')}
        </Text>
        {milestones.milestones.map((item) => (
          <MilestoneCard key={item.id} label={item.labelFr} reached={item.reached} />
        ))}
      </Card>
    </ScrollView>
  );
}
