import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const phases = ['inhale', 'hold', 'exhale'] as const;

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const { colors } = useTheme();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(1);
  const [countdown, setCountdown] = useState(4);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      4,
      false,
    );

    const interval = setInterval(() => {
      setCountdown((current) => (current <= 1 ? 4 : current - 1));
    }, 1000);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((current) => {
        const next = (current + 1) % phases.length;
        if (next === 0) {
          setCycles((value) => {
            const nextValue = value + 1;
            if (nextValue > 4) {
              onComplete();
              return value;
            }
            return nextValue;
          });
        }
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(phaseInterval);
    };
  }, [onComplete, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const phaseLabel = useMemo(() => i18n.t(`sosScreen.${phases[phaseIndex]}`), [phaseIndex]);

  return (
    <View
      style={{
        borderRadius: RADII.lg,
        backgroundColor: colors.bgCard,
        borderWidth: 0.5,
        borderColor: colors.bgCardBorder,
        paddingHorizontal: 18,
        paddingVertical: 22,
        alignItems: 'center',
        gap: 18,
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: RADII.full,
          borderWidth: 2,
          borderColor: 'rgba(124,58,237,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 78,
            height: 78,
            borderRadius: RADII.full,
            borderWidth: 1.5,
            borderColor: 'rgba(124,58,237,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                width: 58,
                height: 58,
                borderRadius: RADII.full,
                borderWidth: 1.5,
                borderColor: 'rgba(167,139,250,0.55)',
                backgroundColor: 'rgba(124,58,237,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <Text
              style={[
                FONTS.black,
                {
                  color: colors.accent,
                  fontSize: 8,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {phaseLabel}
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 24 }]}>{countdown}</Text>
          </Animated.View>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>
          {i18n.t('sosScreen.strongCraving')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, textAlign: 'center' }]}>
          {i18n.t('sosScreen.strongCravingBody')}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignSelf: 'stretch', justifyContent: 'center' }}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 3,
              borderRadius: RADII.full,
              backgroundColor: index === phaseIndex ? colors.accent : colors.dividerStrong,
            }}
          />
        ))}
      </View>

      <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
        {i18n.t('sosScreen.cycleCount', { current: cycles, total: 4 })}
      </Text>
    </View>
  );
}
