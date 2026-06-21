import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(withTiming(1.04, { duration: 180 }), withTiming(1, { duration: 180 }));
  }, [scale, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text className={className}>{value}</Text>
    </Animated.View>
  );
}
