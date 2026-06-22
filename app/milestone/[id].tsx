import { useLocalSearchParams, useRouter } from 'expo-router';
import { Award, Share2, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { MILESTONES } from '@/constants/milestones';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

const CONFETTI = [
  { id: 'c1', label: '🎉', left: 28, delay: 0 },
  { id: 'c2', label: '⭐', left: 96, delay: 90 },
  { id: 'c3', label: '🎊', left: 168, delay: 180 },
  { id: 'c4', label: '✨', left: 236, delay: 260 },
];

export default function MilestoneScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const { moneySavedFormatted } = useSavings();
  const profile = useUserStore((state) => state.profile);
  const { id } = useLocalSearchParams<{ id: string }>();
  const milestone = MILESTONES.find((item) => item.id === id) ?? MILESTONES[0];
  const scale = useSharedValue(0);
  const productType = profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const avoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay,
    productType,
  );
  const [displayAvoided, setDisplayAvoided] = useState(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 420, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 180 }),
    );
  }, [scale]);

  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      const ratio = Math.min(step / steps, 1);
      setDisplayAvoided(Math.round(avoided * ratio));
      if (ratio >= 1) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [avoided]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stats = [
    { value: moneySavedFormatted, label: i18n.t('milestone.savingsLabel'), color: colors.emerald },
    {
      value: `${displayAvoided}`,
      label: i18n.t(`products.${productType}.avoidedLabel`),
      color: colors.accent,
    },
    { value: '+18j', label: i18n.t('milestone.lifeLabel'), color: colors.textPrimary },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: fixed.milestoneBg }}
      contentContainerStyle={{
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxl + 8,
        paddingBottom: SPACING.xxl,
        alignItems: 'center',
      }}
    >
      <View style={{ width: '100%', minHeight: 50 }}>
        {CONFETTI.map((item) => (
          <Animated.Text
            key={item.id}
            entering={FadeInDown.delay(item.delay).duration(700)}
            style={{
              position: 'absolute',
              left: item.left,
              top: 0,
              fontSize: 22,
            }}
          >
            {item.label}
          </Animated.Text>
        ))}
      </View>

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
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 20 }}>{productConfig.emoji}</Text>
          <Award color={colors.accent} size={14} strokeWidth={1.5} />
        </View>
      </Animated.View>

      <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20, marginTop: 22 }]}>
        {milestone.labelFr} !
      </Text>
      <Text
        style={[
          FONTS.regular,
          {
            color: 'rgba(255,255,255,0.40)',
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
        {stats.map((item, index) => (
          <Animated.View
            key={item.label}
            entering={FadeInDown.delay(160 + index * 80).duration(260)}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              paddingHorizontal: 10,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 76,
            }}
          >
            <Text style={[FONTS.black, { color: item.color, fontSize: 15, textAlign: 'center' }]} numberOfLines={2}>
              {item.value}
            </Text>
            <Text
              style={[
                FONTS.bold,
                { color: 'rgba(255,255,255,0.30)', fontSize: 8, marginTop: 6, textAlign: 'center' },
              ]}
            >
              {item.label}
            </Text>
          </Animated.View>
        ))}
      </View>

      <View style={{ width: '100%', marginTop: 28 }}>
        <Button
          label={i18n.t('milestone.shareTikTok')}
          onPress={() =>
            Share.share({
              message: `${milestone.labelFr} sans nicotine. ${moneySavedFormatted} economises avec Respire.`,
            }).catch(() => undefined)
          }
        />
      </View>

      <Pressable
        onPress={() =>
          Share.share({
            message: `${milestone.labelFr} sans nicotine. ${moneySavedFormatted} economises avec Respire.`,
          }).catch(() => undefined)
        }
        style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Share2 color={colors.accent} size={14} strokeWidth={1.5} />
        <Sparkles color={colors.accent} size={12} strokeWidth={1.5} />
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={{
          marginTop: 16,
          borderRadius: RADII.full,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <Text style={[FONTS.regular, { color: 'rgba(255,255,255,0.20)', fontSize: 9 }]}>
          {i18n.t('milestone.cta')} →
        </Text>
      </Pressable>
    </ScrollView>
  );
}
