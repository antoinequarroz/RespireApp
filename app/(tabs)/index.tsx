import { type Href, useRouter } from 'expo-router';
import { Award, Bell, Sparkles, Wallet, Wind, Zap } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { CounterSection } from '@/components/sections/CounterSection';
import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useBehaviorBadges } from '@/hooks/useBehaviorBadges';
import { useCounter } from '@/hooks/useCounter';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { updateWidgetSnapshot } from '@/services/widget';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function formatTimeUntil(targetMs: number, currentMs: number) {
  const remainingMs = Math.max(targetMs - currentMs, 0);
  const totalHours = Math.ceil(remainingMs / (60 * 60 * 1000));

  if (totalHours < 24) {
    return `${totalHours}h`;
  }

  return `${Math.ceil(totalHours / 24)}j`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const rewardGoalLabel = useUserStore((state) => state.rewardGoalLabel);
  const rewardGoalAmount = useUserStore((state) => state.rewardGoalAmount);
  const cravingsHandled = useProgressStore((state) => state.cravingsHandled);
  const appOpenStreak = useProgressStore((state) => state.appOpenStreak);
  const zenSessionsCompleted = useProgressStore((state) => state.zenSessionsCompleted);
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent } = useSavings();
  const { next, progress } = useMilestones();
  const { unlocked } = useBehaviorBadges();
  const health = useHealthStats();
  const productType = profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const cigarettesAvoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay,
    productType,
  );

  useEffect(() => {
    updateWidgetSnapshot({ smokeFreeDays: counter.days, moneySaved }).catch(() => undefined);
  }, [counter.days, moneySaved]);

  const nextHealthDelay = useMemo(
    () => formatTimeUntil(health.next.targetMs, counter.totalMs),
    [counter.totalMs, health.next.targetMs],
  );
  const nextMilestoneDelay = useMemo(
    () => formatTimeUntil(next.targetMs, counter.totalMs),
    [counter.totalMs, next.targetMs],
  );
  const rewardProgress = Math.min(moneySaved / rewardGoalAmount, 1);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 14 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <AppLogo size="header" />
          <View
            style={{
              borderRadius: RADII.full,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              backgroundColor: colors.bgCard,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Sparkles color={colors.accent} size={12} strokeWidth={1.5} />
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 11 }]}>{appOpenStreak}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/settings/notifications')}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell color={colors.accent} size={15} strokeWidth={1.5} />
        </Pressable>
      </View>

      <CounterSection
        days={counter.days}
        hours={counter.hours}
        minutes={counter.minutes}
        seconds={counter.seconds}
        onRelapsePress={() => router.push('/relapse')}
      />

      <Card
        style={{
          backgroundColor: colors.emeraldBg,
          borderColor: colors.emeraldBorder,
          borderWidth: 1,
          borderRadius: 13,
          paddingHorizontal: 14,
          paddingVertical: 11,
          gap: 5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Wallet color={colors.emerald} size={14} strokeWidth={1.5} />
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.emerald,
                opacity: 0.65,
                fontSize: 8,
                letterSpacing: 1,
                textTransform: 'uppercase',
              },
            ]}
          >
            {i18n.t('home.moneySaved')}
          </Text>
        </View>
        <Text style={[FONTS.black, { fontSize: 22, color: colors.emerald }]}>{moneySavedFormatted}</Text>
        <Animated.Text
          key={`${equivalent.emoji}-${equivalent.labelFr}`}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(220)}
          style={[FONTS.regular, { fontSize: 10, color: colors.emerald, opacity: 0.6, fontStyle: 'italic' }]}
        >
          {productConfig.emoji} {equivalent.labelFr}
        </Animated.Text>
      </Card>

      <Pressable onPress={() => router.push('/sos')}>
        <View
          style={{
            backgroundColor: colors.accentBg,
            borderRadius: 13,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Zap color={colors.accent} size={18} strokeWidth={2} />
          <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>{i18n.t('home.openSos')}</Text>
        </View>
      </Pressable>

      <Pressable onPress={() => router.push('/zen')}>
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 4 }}>
              <Text
                style={[
                  FONTS.bold,
                  {
                    color: colors.textMuted,
                    fontSize: 8,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {i18n.t('zen.title')}
              </Text>
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>
                {i18n.t('zen.homeTitle')}
              </Text>
            </View>
            <Wind color={colors.accent} size={18} strokeWidth={1.5} />
          </View>

          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            {i18n.t('zen.homeBody')}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View
              style={{
                flex: 1,
                borderRadius: RADII.md,
                backgroundColor: colors.bgCard,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <Text style={[FONTS.black, { color: colors.accent, fontSize: 16 }]}>{zenSessionsCompleted}</Text>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
                {i18n.t('zen.completedSessions')}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderRadius: RADII.md,
                backgroundColor: colors.bgCard,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>3</Text>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
                {i18n.t('zen.availableTechniques')}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/reward' as Href)}>
        <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 4 }}>
            <Text
              style={[
                FONTS.bold,
                {
                  color: colors.textMuted,
                  fontSize: 8,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {i18n.t('home.rewardGoalLabel')}
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>{rewardGoalLabel}</Text>
          </View>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 16 }]}>
            {Math.round(rewardProgress * 100)}%
          </Text>
        </View>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
          {moneySavedFormatted} / {rewardGoalAmount} EUR
        </Text>
        <View
          style={{
            height: 6,
            borderRadius: RADII.full,
            backgroundColor: colors.dividerStrong,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.max(rewardProgress * 100, 4)}%`,
              height: 6,
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
            }}
          />
        </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push(`/milestone/${next.id}`)}>
        <Card
          style={{
            borderRadius: 13,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: RADII.full,
              backgroundColor: 'rgba(124,58,237,0.20)',
              borderWidth: 1.5,
              borderColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award color={colors.accent} size={14} strokeWidth={1.5} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 10, marginBottom: 4 }]}>
              {next.labelFr}
            </Text>
            <View
              style={{
                height: 3,
                borderRadius: RADII.full,
                backgroundColor: 'rgba(167,139,250,0.12)',
                overflow: 'hidden',
              }}
            >
              <Animated.View
                entering={FadeIn.duration(300)}
                style={{
                  width: `${Math.max(progress * 100, 6)}%`,
                  height: 3,
                  borderRadius: RADII.full,
                  backgroundColor: colors.accent,
                }}
              />
            </View>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, marginTop: 6 }]}>
              Dans {nextMilestoneDelay}
            </Text>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/stats')}>
        <Card style={{ gap: 12 }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 8,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              },
            ]}
          >
            {i18n.t('home.healthTeaser')}
          </Text>

          <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            <View style={{ flex: 1 }}>
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>{cigarettesAvoided}</Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11, marginTop: 4 }]}>
                {i18n.t(`products.${productType}.avoidedLabel`)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[FONTS.black, { color: colors.accent, fontSize: 22 }]}>{nextHealthDelay}</Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11, marginTop: 4 }]}>
                {i18n.t('home.nextHealthBenefit')}
              </Text>
            </View>
          </View>

          <Text style={[FONTS.regular, { color: colors.accent, fontSize: 12 }]}>{health.next.labelFr}</Text>
        </Card>
      </Pressable>

      <Card style={{ gap: 12 }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 8,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('home.recoveryTitle')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              borderRadius: RADII.md,
              backgroundColor: colors.bgCard,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 16 }]}>{cravingsHandled}</Text>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
              {i18n.t('home.cravingsHandled')}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: RADII.md,
              backgroundColor: colors.bgCard,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>{appOpenStreak}j</Text>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
              {i18n.t('home.currentStreak')}
            </Text>
          </View>
        </View>
      </Card>

      {unlocked.length > 0 ? (
        <Card style={{ gap: 10 }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 8,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              },
            ]}
          >
            {i18n.t('statsScreen.behaviorBadges')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {unlocked.slice(0, 3).map((badge) => (
              <View
                key={badge.id}
                style={{
                  borderRadius: RADII.md,
                  backgroundColor: colors.accentBg,
                  borderWidth: 0.5,
                  borderColor: colors.accentBorder,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11 }]}>{badge.labelFr}</Text>
              </View>
            ))}
          </View>
        </Card>
      ) : null}
    </ScrollView>
  );
}
