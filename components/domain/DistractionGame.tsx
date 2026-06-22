import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
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
  const { colors } = useTheme();
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
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 13 }]}>{headline}</Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('sosScreen.timeLeft')}: {timeLeft}s
        </Text>
      </View>
      <View
        style={{
          position: 'relative',
          height: 208,
          borderRadius: RADII.md,
          backgroundColor: colors.bgSurface,
          overflow: 'hidden',
        }}
      >
        {targets.map((target) => (
          <Pressable
            key={target.id}
            style={{
              position: 'absolute',
              left: target.left,
              top: target.top,
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.accentBg,
              borderColor: colors.accentBorder,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setScore((value) => value + 1);
              setTargets(createTargets());
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 18 }]}>+</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
