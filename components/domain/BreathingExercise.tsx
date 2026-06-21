import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const phases = ['inhale', 'hold', 'exhale'] as const;

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 4000 }),
        withTiming(1.15, { duration: 4000 }),
        withTiming(0.9, { duration: 4000 }),
      ),
      4,
      false,
    );

    const interval = setInterval(() => {
      setPhaseIndex((current) => {
        const next = (current + 1) % phases.length;
        if (next === 0) {
          setCycles((value) => {
            const nextValue = value + 1;
            if (nextValue >= 4) {
              onComplete();
            }
            return nextValue;
          });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [onComplete, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const phaseLabel = useMemo(() => i18n.t(`sosScreen.${phases[phaseIndex]}`), [phaseIndex]);

  return (
    <Card className="items-center gap-4">
      <Animated.View
        className="h-52 w-52 items-center justify-center rounded-full bg-primary/20"
        style={animatedStyle}
      >
        <View className="h-32 w-32 rounded-full bg-primary/70" />
      </Animated.View>
      <Text className="text-2xl font-semibold text-ink dark:text-white">{phaseLabel}</Text>
      <Text className="text-sm text-zinc-500 dark:text-zinc-400">
        {cycles}/4 {i18n.t('sosScreen.cycles')}
      </Text>
      <Button label={i18n.t('sosScreen.restart')} variant="secondary" onPress={onComplete} />
    </Card>
  );
}
