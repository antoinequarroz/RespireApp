import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { MILESTONES } from '@/constants/milestones';
import { FONTS, RADII, SPACING } from '@/constants/theme';
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

  const stats = [
    { value: milestone.labelFr, label: i18n.t('milestone.badgeLabel') },
    { value: moneySavedFormatted, label: i18n.t('milestone.savingsLabel') },
    { value: i18n.t('milestone.prideValue'), label: i18n.t('milestone.prideLabel') },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgDeep }}
      contentContainerStyle={{
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxl + 8,
        paddingBottom: SPACING.xxl,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 22, marginTop: 8, marginBottom: 18 }}>🎉 ⭐ 🎊</Text>

      <Animated.View
        style={[
          animatedBadgeStyle,
          {
            width: 80,
            height: 80,
            borderRadius: RADII.full,
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
            borderRadius: RADII.full,
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
        {milestone.labelFr} sans fumer !
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
        {i18n.t('milestone.subtitle')}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 24, width: '100%' }}>
        {stats.map((item) => (
          <View
            key={item.label}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: colors.bgCard,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              paddingHorizontal: 10,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 76,
            }}
          >
            <Text
              style={[FONTS.black, { color: colors.accent, fontSize: 15, textAlign: 'center' }]}
              numberOfLines={2}
            >
              {item.value}
            </Text>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, marginTop: 6, textAlign: 'center' }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ width: '100%', marginTop: 28 }}>
        <Button
          label={i18n.t('milestone.shareTikTok')}
          onPress={() =>
            Share.share({
              message: `${milestone.labelFr} sans fumer. ${moneySavedFormatted} economises avec Respire.`,
            }).catch(() => undefined)
          }
        />
      </View>

      <Pressable
        onPress={() => router.back()}
        style={{
          marginTop: 16,
          borderRadius: RADII.full,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9 }]}>
          {i18n.t('milestone.cta')} →
        </Text>
      </Pressable>
    </ScrollView>
  );
}
