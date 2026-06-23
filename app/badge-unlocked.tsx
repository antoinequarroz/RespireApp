import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BEHAVIOR_BADGES } from '@/constants/behaviorBadges';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export default function BadgeUnlockedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fixed, colors } = useTheme();

  const badge = BEHAVIOR_BADGES.find((b) => b.id === id);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 420, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 180 }),
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!badge) {
    router.back();
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: fixed.milestoneBg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
        gap: 28,
      }}
    >
      {/* Badge animé */}
      <Animated.View style={animatedStyle}>
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: 'rgba(167,139,250,0.12)',
            borderWidth: 1.5,
            borderColor: colors.accentBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 52 }}>{badge.emoji}</Text>
        </View>
      </Animated.View>

      {/* Textes */}
      <Animated.View entering={FadeInDown.delay(300).duration(300)} style={{ alignItems: 'center', gap: 10 }}>
        <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }]}>
          Badge débloqué
        </Text>
        <Text style={[FONTS.black, { color: '#F8F7FF', fontSize: 26, textAlign: 'center' }]}>
          {badge.labelFr}
        </Text>
        <Text style={[FONTS.regular, { color: 'rgba(248,247,255,0.50)', fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 19 }]}>
          {badge.descriptionFr}
        </Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View entering={FadeInDown.delay(500).duration(300)} style={{ width: '100%', gap: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: colors.accent,
            borderRadius: RADII.lg,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={[FONTS.bold, { color: '#fff', fontSize: 15 }]}>Continuer</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
