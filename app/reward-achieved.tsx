import { type Href, useRouter } from 'expo-router';
import { Gift, Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { FONTS, RADII } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function RewardAchievedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const rewardGoalLabel = useUserStore((state) => state.rewardGoalLabel);
  const rewardGoalAmount = useUserStore((state) => state.rewardGoalAmount);
  const { moneySavedFormatted } = useSavings();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View entering={ZoomIn.duration(450)} style={{ alignItems: 'center', gap: 18 }}>
        <View
          style={{
            width: 92,
            height: 92,
            borderRadius: RADII.full,
            borderWidth: 2,
            borderColor: colors.accentBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: RADII.full,
              backgroundColor: colors.accentBg,
              borderWidth: 2,
              borderColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gift color={colors.accent} size={28} strokeWidth={1.8} />
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(400)} style={{ alignItems: 'center', gap: 8 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, textAlign: 'center' }]}>
            {i18n.t('reward.achievedTitle')}
          </Text>
          <Text
            style={[
              FONTS.regular,
              { color: colors.textSecondary, fontSize: 12, textAlign: 'center', maxWidth: 300 },
            ]}
          >
            {i18n.t('reward.achievedBody', {
              label: rewardGoalLabel,
              amount: rewardGoalAmount,
              saved: moneySavedFormatted,
            })}
          </Text>
        </Animated.View>

        <View
          style={{
            width: '100%',
            borderRadius: RADII.xl,
            backgroundColor: colors.bgCard,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            padding: 14,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1 }]}>
              {i18n.t('reward.label')}
            </Text>
            <Sparkles color={colors.accent} size={16} strokeWidth={1.5} />
          </View>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 18 }]}>{rewardGoalLabel}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
            {moneySavedFormatted} / {rewardGoalAmount} EUR
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace('/(tabs)' as Href)}
          style={{
            alignSelf: 'stretch',
            minHeight: 48,
            borderRadius: RADII.lg,
            backgroundColor: '#7C3AED',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 13 }]}>
            {i18n.t('reward.achievedCta')}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
