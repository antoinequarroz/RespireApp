import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getThirtyDayTrend } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';
import { useProgressStore } from '@/store/progressStore';

export default function JournalScreen() {
  const router = useRouter();
  const isPremium = usePremiumStore((state) => state.isPremium);
  const entries = useProgressStore((state) => state.journalEntries);
  const addJournalEntry = useProgressStore((state) => state.addJournalEntry);
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(2);
  const [note, setNote] = useState('');

  if (!isPremium) {
    return (
      <View className="flex-1 justify-center gap-6 bg-white px-6 dark:bg-night">
        <Card className="gap-3">
          <Text className="text-2xl font-bold text-ink dark:text-white">
            {i18n.t('journalScreen.lockedTitle')}
          </Text>
          <Text className="text-base text-zinc-600 dark:text-zinc-300">
            {i18n.t('journalScreen.lockedBody')}
          </Text>
        </Card>
        <Button label={i18n.t('common.premium')} onPress={() => router.push('/paywall')} />
      </View>
    );
  }

  const trend = getThirtyDayTrend(entries);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="pt-6 text-3xl font-bold text-ink dark:text-white">
        {i18n.t('journalScreen.title')}
      </Text>
      <Card className="gap-4">
        <Text className="text-base text-zinc-600 dark:text-zinc-300">
          {i18n.t('journalScreen.subtitle')}
        </Text>
        <Text className="text-base text-ink dark:text-white">
          {i18n.t('journalScreen.mood')}: {mood}
        </Text>
        <View className="flex-row gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button key={value} label={`${value}`} variant={mood === value ? 'primary' : 'secondary'} onPress={() => setMood(value)} />
          ))}
        </View>
        <Text className="text-base text-ink dark:text-white">
          {i18n.t('journalScreen.craving')}: {craving}
        </Text>
        <View className="flex-row gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button key={value} label={`${value}`} variant={craving === value ? 'primary' : 'secondary'} onPress={() => setCraving(value)} />
          ))}
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          placeholder={i18n.t('journalScreen.placeholder')}
          className="min-h-28 rounded-md bg-white px-4 py-3 text-base text-ink dark:bg-zinc-950 dark:text-white"
        />
        <Button
          label={i18n.t('common.save')}
          onPress={() =>
            addJournalEntry({
              id: Date.now().toString(),
              date: new Date().toISOString().slice(0, 10),
              mood,
              craving,
              note,
            })
          }
        />
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('journalScreen.history')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {trend.entries.map((entry) => (
            <View
              key={entry.id}
              className="h-10 w-10 rounded-sm"
              style={{ backgroundColor: `rgba(39,174,96,${entry.mood / 5})` }}
            />
          ))}
        </View>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          {i18n.t('journalScreen.mood')}: {trend.averageMood} | {i18n.t('journalScreen.craving')}:{' '}
          {trend.averageCraving}
        </Text>
      </Card>
    </ScrollView>
  );
}
