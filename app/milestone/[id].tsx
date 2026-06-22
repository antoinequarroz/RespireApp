import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { MILESTONES } from '@/constants/milestones';
import { FONTS, SPACING } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

export default function MilestoneScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { moneySavedFormatted } = useSavings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const milestone = MILESTONES.find((item) => item.id === id) ?? MILESTONES[0];
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 420, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 180 }),
    );
  }, [scale]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22, marginBottom: 18 }}>🎉 ⭐ 🎊</Text>

        <Animated.View
          style={[
            animatedBadgeStyle,
            {
              width: 80,
              height: 80,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: 'rgba(167,139,250,0.30)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: colors.accent,
              backgroundColor: 'rgba(124,58,237,0.20)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 28 }}>🏆</Text>
          </View>
        </Animated.View>

        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20, marginTop: 22 }]}>
          {milestone.labelFr} !
        </Text>
        <Text
          style={[
            FONTS.regular,
            {
              color: colors.textSecondary,
              fontSize: 10,
              textAlign: 'center',
              marginTop: 8,
              maxWidth: 260,
            },
          ]}
        >
          Tu viens de verrouiller un cap visible. C est le moment qui doit donner envie de continuer.
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
          <View
            style={{
              minWidth: 90,
              borderRadius: 10,
              backgroundColor: colors.bgCard,
              paddingHorizontal: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 15 }]}>{milestone.labelFr}</Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8 }]}>badge</Text>
          </View>
          <View
            style={{
              minWidth: 90,
              borderRadius: 10,
              backgroundColor: colors.bgCard,
              paddingHorizontal: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 15 }]}>
              {moneySavedFormatted}
            </Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8 }]}>economies</Text>
          </View>
          <View
            style={{
              minWidth: 90,
              borderRadius: 10,
              backgroundColor: colors.bgCard,
              paddingHorizontal: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 15 }]}>100%</Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8 }]}>fierte</Text>
          </View>
        </View>

        <Button
          label={`${i18n.t('milestone.shareTikTok')} 🎵`}
          style={{ alignSelf: 'stretch', marginTop: 28 }}
          onPress={() => router.back()}
        />
        <Text
          style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 16 }]}
          onPress={() => router.back()}
        >
          {i18n.t('milestone.cta')} →
        </Text>
      </View>
    </View>
  );
}
