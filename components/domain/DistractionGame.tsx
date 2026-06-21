import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';

interface DistractionGameProps {
  onComplete: () => void;
}

interface Target {
  id: string;
  left: number;
  top: number;
}

function createTargets(): Target[] {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `target-${index}-${Math.random().toString(36).slice(2, 8)}`,
    left: 12 + (index % 3) * 92,
    top: 12 + Math.floor(index / 3) * 92,
  }));
}

export function DistractionGame({ onComplete }: DistractionGameProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>(createTargets());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const headline = useMemo(() => `${i18n.t('sosScreen.score')}: ${score}`, [score]);

  return (
    <Card className="gap-4">
      <View className="flex-row justify-between">
        <Text className="text-lg font-semibold text-ink dark:text-white">{headline}</Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          {i18n.t('sosScreen.timeLeft')}: {timeLeft}s
        </Text>
      </View>
      <View className="relative h-52 rounded-md bg-zinc-100 dark:bg-zinc-950">
        {targets.map((target) => (
          <Pressable
            key={target.id}
            className="absolute h-14 w-14 items-center justify-center rounded-full bg-accent"
            style={{ left: target.left, top: target.top }}
            onPress={() => {
              setScore((value) => value + 1);
              setTargets(createTargets());
            }}
          >
            <Text className="text-lg font-bold text-white">+</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
