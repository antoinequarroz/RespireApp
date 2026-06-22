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

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.04, { duration }),
      withTiming(1, { duration }),
    );
  }, [duration, scale, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(220)} style={animatedStyle}>
      <Text className={className} style={textStyle}>
        {value}
      </Text>
    </Animated.View>
  );
}
