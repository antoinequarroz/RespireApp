import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CounterSection } from '@/components/sections/CounterSection';
import { HealthSection } from '@/components/sections/HealthSection';
import { MilestonesSection } from '@/components/sections/MilestonesSection';
import { SavingsSection } from '@/components/sections/SavingsSection';
import { Button } from '@/components/ui/Button';
import { useCounter } from '@/hooks/useCounter';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { i18n } from '@/services/i18n';
import { updateWidgetSnapshot } from '@/services/widget';

export default function HomeScreen() {
  const router = useRouter();
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent } = useSavings();
  const { next, progress } = useMilestones();
  const health = useHealthStats();

  useEffect(() => {
    updateWidgetSnapshot({ smokeFreeDays: counter.days, moneySaved }).catch(() => undefined);
  }, [counter.days, moneySaved]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View className="gap-2 pt-6">
        <Text className="text-4xl font-bold text-ink dark:text-white">{i18n.t('app.name')}</Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">{i18n.t('app.tagline')}</Text>
      </View>

      <CounterSection
        value={`${counter.days}j ${counter.hours}h ${counter.minutes}m ${counter.seconds}s`}
      />
      <SavingsSection
        amount={moneySavedFormatted}
        equivalentLabel={equivalent.labelFr}
        equivalentEmoji={equivalent.emoji}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button label={i18n.t('home.openSos')} variant="sos" onPress={() => router.push('/sos')} />
        </View>
        <View className="flex-1">
          <Button label={i18n.t('home.openStats')} variant="secondary" onPress={() => router.push('/stats')} />
        </View>
      </View>
      <MilestonesSection nextLabel={next.labelFr} progress={progress} />
      <HealthSection progress={health.progressRatio} nextLabel={health.next.labelFr} completed={health.completed} />
    </ScrollView>
  );
}
