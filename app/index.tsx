import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppLogo } from '@/components/ui/AppLogo';
import { useTheme } from '@/hooks/useTheme';
import { useUserStore } from '@/store/userStore';

export default function SplashRoute() {
  const router = useRouter();
  const { colors } = useTheme();
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const particleOne = useSharedValue(0);
  const particleTwo = useSharedValue(0);
  const particleThree = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
    particleOne.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, false);
    particleTwo.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1, false);
    particleThree.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.linear }), -1, false);

    const timeout = setTimeout(() => {
      router.replace(hasCompletedOnboarding ? '/(tabs)' : '/welcome');
    }, 2200);

    return () => clearTimeout(timeout);
  }, [hasCompletedOnboarding, opacity, particleOne, particleThree, particleTwo, router, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const particleStyleOne = useAnimatedStyle(() => ({
    opacity: 0.15 + (1 - particleOne.value) * 0.25,
    transform: [{ translateY: -30 * particleOne.value }],
    left: -42,
  }));
  const particleStyleTwo = useAnimatedStyle(() => ({
    opacity: 0.15 + (1 - particleTwo.value) * 0.25,
    transform: [{ translateY: -30 * particleTwo.value }],
    left: 0,
  }));
  const particleStyleThree = useAnimatedStyle(() => ({
    opacity: 0.15 + (1 - particleThree.value) * 0.25,
    transform: [{ translateY: -30 * particleThree.value }],
    left: 38,
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgPrimary,
      }}
    >
      <Animated.View style={[{ alignItems: 'center' }, animatedStyle]}>
        <View style={{ width: 120, height: 42, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Animated.View
            style={[
              particleStyleOne,
              {
                position: 'absolute',
                bottom: 0,
                width: 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: colors.accent,
              },
            ]}
          />
          <Animated.View
            style={[
              particleStyleTwo,
              {
                position: 'absolute',
                bottom: 6,
                width: 5,
                height: 5,
                borderRadius: 999,
                backgroundColor: colors.accent,
              },
            ]}
          />
          <Animated.View
            style={[
              particleStyleThree,
              {
                position: 'absolute',
                bottom: 3,
                width: 7,
                height: 7,
                borderRadius: 999,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <View
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1.5,
              borderColor: colors.accentBorder,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: colors.accent,
              opacity: 0.55,
            }}
          />
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: colors.accent,
            }}
          />
        </View>

        <AppLogo size="hero" />
      </Animated.View>
    </View>
  );
}
