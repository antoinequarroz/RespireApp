import { ScrollView, Text, View } from 'react-native';

import { BreathingExercise } from '@/components/domain/BreathingExercise';
import { DistractionGame } from '@/components/domain/DistractionGame';
import { Button } from '@/components/ui/Button';
import { useSos } from '@/hooks/useSos';
import { i18n } from '@/services/i18n';

export default function SosScreen() {
  const { mode, setMode, sessionDone, completeSession } = useSos();

  return (
    <ScrollView className="flex-1 bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="pt-10 text-3xl font-bold text-white">{i18n.t('sosScreen.title')}</Text>
      <Text className="text-base text-zinc-300">{i18n.t('sosScreen.subtitle')}</Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label={i18n.t('sosScreen.breathing')}
            variant={mode === 'breathing' ? 'primary' : 'secondary'}
            onPress={() => setMode('breathing')}
          />
        </View>
        <View className="flex-1">
          <Button
            label={i18n.t('sosScreen.game')}
            variant={mode === 'game' ? 'primary' : 'secondary'}
            onPress={() => setMode('game')}
          />
        </View>
      </View>
      {mode === 'breathing' ? (
        <BreathingExercise onComplete={completeSession} />
      ) : (
        <DistractionGame onComplete={completeSession} />
      )}
      {sessionDone ? (
        <Text className="text-center text-base font-semibold text-accent">
          {i18n.t('sosScreen.done')}
        </Text>
      ) : null}
    </ScrollView>
  );
}
