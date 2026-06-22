import { useEffect } from 'react';
import { type StyleProp, Text, type TextStyle } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: string;
  className?: string;
  textStyle?: StyleProp<TextStyle>;
  duration?: number;
}

export function AnimatedCounter({
  value,
  className = '',
  textStyle,
  duration = 180,
}: AnimatedCounterProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(8);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.04, { duration }),
      withTiming(1, { duration }),
    );
    translateY.value = 8;
    opacity.value = 0.55;
    translateY.value = withTiming(0, { duration: 160 });
    opacity.value = withTiming(1, { duration: 160 });
  }, [duration, opacity, scale, translateY, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(220)} style={animatedStyle}>
      <Animated.View style={slideStyle}>
        <Text className={className} style={textStyle}>
          {value}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
