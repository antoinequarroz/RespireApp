import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

type BreathPhaseKey = 'inhale' | 'hold' | 'exhale' | 'pause';
export type BreathingTechniqueId = 'box' | 'coherence' | '478' | 'wimhof';

interface BreathPhase {
  key: BreathPhaseKey;
  duration: number;
  targetScale: number;
}

interface BreathingTechnique {
  id: BreathingTechniqueId;
  titleKey: string;
  bodyKey: string;
  cycles: number;
  phases: BreathPhase[];
}

const BREATHING_TECHNIQUES: Record<BreathingTechniqueId, BreathingTechnique> = {
  wimhof: {
    id: 'wimhof',
    titleKey: 'zen.techniques.wimhof',
    bodyKey: 'zen.techniques.wimhofBody',
    cycles: 3,
    phases: [
      { key: 'inhale', duration: 15, targetScale: 1 },
      { key: 'hold', duration: 30, targetScale: 1 },
      { key: 'exhale', duration: 5, targetScale: 0.85 },
      { key: 'pause', duration: 10, targetScale: 0.85 },
    ],
  },
  box: {
    id: 'box',
    titleKey: 'zen.techniques.box',
    bodyKey: 'zen.techniques.boxBody',
    cycles: 15,
    phases: [
      { key: 'inhale', duration: 4, targetScale: 1 },
      { key: 'hold', duration: 4, targetScale: 1 },
      { key: 'exhale', duration: 4, targetScale: 0.85 },
      { key: 'pause', duration: 4, targetScale: 0.85 },
    ],
  },
  coherence: {
    id: 'coherence',
    titleKey: 'zen.techniques.coherence',
    bodyKey: 'zen.techniques.coherenceBody',
    cycles: 30,
    phases: [
      { key: 'inhale', duration: 5, targetScale: 1 },
      { key: 'exhale', duration: 5, targetScale: 0.85 },
    ],
  },
  '478': {
    id: '478',
    titleKey: 'zen.techniques.fourSevenEight',
    bodyKey: 'zen.techniques.fourSevenEightBody',
    cycles: 4,
    phases: [
      { key: 'inhale', duration: 4, targetScale: 1 },
      { key: 'hold', duration: 7, targetScale: 1 },
      { key: 'exhale', duration: 8, targetScale: 0.85 },
    ],
  },
};

interface BreathingExerciseProps {
  onComplete: () => void;
  techniqueId?: BreathingTechniqueId;
  cycleCount?: number;
  tone?: 'sos' | 'zen';
}

export function BreathingExercise({
  onComplete,
  techniqueId = 'box',
  cycleCount,
  tone = 'sos',
}: BreathingExerciseProps) {
  const { colors } = useTheme();
  const technique = BREATHING_TECHNIQUES[techniqueId];
  const totalCycles = cycleCount ?? technique.cycles;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(1);
  const [countdown, setCountdown] = useState(technique.phases[0]?.duration ?? 4);
  const [done, setDone] = useState(false);
  const scale = useSharedValue(technique.phases[0]?.targetScale ?? 0.85);
  const pulse = useSharedValue(0);

  useEffect(() => {
    const currentPhase = technique.phases[phaseIndex];
    scale.value = withTiming(currentPhase.targetScale, {
      duration: currentPhase.duration * 1000,
      easing: Easing.inOut(Easing.ease),
    });
    pulse.value = 0;
    pulse.value = withTiming(1, {
      duration: currentPhase.duration * 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [phaseIndex, pulse, scale, technique.phases]);

  useEffect(() => {
    if (done) {
      return;
    }

    let secondsInPhase = technique.phases[phaseIndex]?.duration ?? 4;

    const interval = setInterval(() => {
      secondsInPhase -= 1;

      if (secondsInPhase <= 0) {
        const nextPhase = (phaseIndex + 1) % technique.phases.length;

        if (nextPhase === 0) {
          if (cycles >= totalCycles) {
            clearInterval(interval);
            setDone(true);
            onComplete();
            return;
          }
          setCycles((value) => value + 1);
        }

        const nextDuration = technique.phases[nextPhase]?.duration ?? 4;
        secondsInPhase = nextDuration;
        setCountdown(nextDuration);
        setPhaseIndex(nextPhase);
        return;
      }

      setCountdown(secondsInPhase);
    }, 1000);

    return () => clearInterval(interval);
  }, [cycles, done, onComplete, phaseIndex, technique.phases, totalCycles]);

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.04, tone === 'zen' ? 0.12 : 0.09]),
  }));

  const progress = useMemo(() => {
    if (totalCycles <= 1) {
      return 1;
    }
    return Math.min((cycles - 1) / totalCycles, 1);
  }, [cycles, totalCycles]);

  const phaseLabel = useMemo(
    () => i18n.t(`sosScreen.${technique.phases[phaseIndex]?.key ?? 'inhale'}`),
    [phaseIndex, technique.phases],
  );

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
        overflow: 'hidden',
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          pulseStyle,
          {
            position: 'absolute',
            inset: 0,
            backgroundColor: tone === 'zen' ? colors.emeraldBg : colors.accentBg,
          },
        ]}
      />

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
              animatedInnerStyle,
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
          {i18n.t(technique.titleKey)}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, textAlign: 'center' }]}>
          {i18n.t(technique.bodyKey)}
        </Text>
      </View>

      <View
        style={{
          alignSelf: 'stretch',
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.dividerStrong,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${Math.max(progress * 100, 4)}%`,
            height: 4,
            borderRadius: RADII.full,
            backgroundColor: colors.accent,
          }}
        />
      </View>

      <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
        {i18n.t('sosScreen.cycleCount', { current: cycles, total: totalCycles })}
      </Text>
    </View>
  );
}
