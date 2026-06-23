import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Share, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';

import { Button } from '@/components/ui/Button';
import { MILESTONES } from '@/constants/milestones';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { canShowDailyMotivation, markMotivationShownToday } from '@/services/motivation';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

const CONFETTI = [
  { id: 'c1', label: '🎉', left: 28, delay: 0 },
  { id: 'c2', label: '⭐', left: 96, delay: 90 },
  { id: 'c3', label: '🎊', left: 168, delay: 180 },
  { id: 'c4', label: '✨', left: 236, delay: 260 },
];

const EMOJI_MAP: Record<string, string> = {
  '20min': '❤️',
  '1h': '💨',
  '24h': '🛡️',
  '48h': '👃',
  '1week': '🩸',
  '1month': '🫁',
  '3months': '✨',
  '6months': '🏃',
  '1year': '🏆',
  '5years': '🛡️',
  '10years': '🫁',
  '15years': '💚',
};

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
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<View>(null);

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
      if (ratio >= 1) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [avoided]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stats = [
    { value: moneySavedFormatted, label: i18n.t('milestone.savingsLabel'), color: colors.emerald },
    { value: `${displayAvoided}`, label: i18n.t(`products.${productType}.avoidedLabel`), color: colors.accent },
    { value: '+18j', label: i18n.t('milestone.lifeLabel'), color: colors.textPrimary },
  ];

  const shareMessage = `${milestone.labelFr} ${i18n.t('milestone.withoutNicotine')}. ${moneySavedFormatted} ${i18n.t('milestone.savingsLabel')} — Respire`;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const uri = await captureRef(shareCardRef, {
        format: 'png',
        quality: 0.92,
        width: 1080,
        height: 1080,
      });
      await Share.share(
        Platform.OS === 'ios'
          ? { url: uri, message: shareMessage }
          : { message: shareMessage },
      );
    } catch {
      // Fallback to text-only share (also handles simulator / missing native module)
      await Share.share({ message: shareMessage }).catch(() => undefined);
    } finally {
      setIsSharing(false);
    }
  };

  const closeMilestone = () => {
    canShowDailyMotivation()
      .then((shouldShow) => {
        if (!shouldShow) { router.back(); return; }
        return markMotivationShownToday().then(() =>
          router.replace(
            `/motivation?trigger=milestone&streak=${useProgressStore.getState().appOpenStreak}` as Href,
          ),
        );
      })
      .catch(() => router.back());
  };

  return (
    <View style={{ flex: 1, backgroundColor: fixed.milestoneBg }}>
      {/* Contenu scrollable */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACING.xl,
          paddingTop: SPACING.xxl + 8,
          paddingBottom: SPACING.xxl,
          alignItems: 'center',
        }}
      >
        {/* Confetti */}
        <View style={{ width: '100%', minHeight: 50 }}>
          {CONFETTI.map((item) => (
            <Animated.Text
              key={item.id}
              entering={FadeInDown.delay(item.delay).duration(700)}
              style={{ position: 'absolute', left: item.left, top: 0, fontSize: 22 }}
            >
              {item.label}
            </Animated.Text>
          ))}
        </View>

        {/* Badge animé */}
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
            <Text style={{ fontSize: 26 }}>{productConfig.emoji}</Text>
          </View>
        </Animated.View>

        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20, marginTop: 22, textAlign: 'center' }]}>
          {milestone.labelFr} !
        </Text>
        <Text
          style={[
            FONTS.regular,
            { color: 'rgba(255,255,255,0.40)', fontSize: 10, textAlign: 'center', marginTop: 8, maxWidth: 260 },
          ]}
        >
          {i18n.t('milestone.subtitle')}
        </Text>

        {/* Stats */}
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
              <Text style={[FONTS.bold, { color: 'rgba(255,255,255,0.30)', fontSize: 8, marginTop: 6, textAlign: 'center' }]}>
                {item.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Bouton partager */}
        <View style={{ width: '100%', marginTop: 28, gap: 12 }}>
          <Button
            label={isSharing ? i18n.t('milestone.sharing') : i18n.t('milestone.shareButton')}
            onPress={handleShare}
          />
          <Pressable onPress={closeMilestone} style={{ alignSelf: 'center', paddingVertical: 6 }}>
            <Text style={[FONTS.regular, { color: 'rgba(255,255,255,0.25)', fontSize: 10 }]}>
              {i18n.t('milestone.cta')} →
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Share card hors-écran (1080×1080) capturée par view-shot */}
      <View
        ref={shareCardRef}
        collapsable={false}
        style={{
          position: 'absolute',
          width: 1080,
          height: 1080,
          top: -9999,
          left: 0,
          backgroundColor: '#120F1E',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          gap: 40,
        }}
      >
        {/* Logo / app name */}
        <Text style={{ color: 'rgba(167,139,250,0.5)', fontSize: 28, fontFamily: 'System', fontWeight: '700', letterSpacing: 6, textTransform: 'uppercase' }}>
          RESPIRE
        </Text>

        {/* Emoji produit */}
        <Text style={{ fontSize: 96 }}>{productConfig.emoji}</Text>

        {/* Palier */}
        <Text style={{ color: '#F8F7FF', fontSize: 64, fontWeight: '900', textAlign: 'center', lineHeight: 72 }}>
          {milestone.labelFr}
        </Text>

        <Text style={{ color: 'rgba(248,247,255,0.40)', fontSize: 32, fontWeight: '400', textAlign: 'center' }}>
          {i18n.t('milestone.withoutNicotine')}
        </Text>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          {[
            { label: i18n.t('milestone.savingsLabel'), value: moneySavedFormatted, color: '#10B981' },
            { label: i18n.t(`products.${productType}.avoidedLabel`), value: `${avoided}`, color: '#A78BFA' },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                borderRadius: 24,
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                padding: 32,
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: s.color, fontSize: 48, fontWeight: '900' }}>{s.value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 20, fontWeight: '600' }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 22, marginTop: 20 }}>
          respireapp.com
        </Text>
      </View>
    </View>
  );
}
