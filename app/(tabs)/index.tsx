import { type Href, useRouter } from 'expo-router';
import { Bell, Bookmark, Flame, Wind, Zap } from 'lucide-react-native';
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
import { useMotivationPhrase } from '@/hooks/useMotivationPhrase';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { useUserLevel } from '@/hooks/useUserLevel';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { updateWidgetSnapshot } from '@/services/widget';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function formatTimeUntil(targetMs: number, currentMs: number) {
  const remainingMs = Math.max(targetMs - currentMs, 0);
  const totalHours = Math.ceil(remainingMs / (60 * 60 * 1000));
  if (totalHours < 24) return `${totalHours}h`;
  return `${Math.ceil(totalHours / 24)}j`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const rewardGoals = useUserStore((state) => state.rewardGoals);
  const cravingsHandled = useProgressStore((state) => state.cravingsHandled);
  const appOpenStreak = useProgressStore((state) => state.appOpenStreak);
  const zenSessionsCompleted = useProgressStore((state) => state.zenSessionsCompleted);
  const weeklyChallenge = useProgressStore((state) => state.weeklyChallenge);
  const celebratedRewardGoalIds = useProgressStore((state) => state.celebratedRewardGoalIds);
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent, filteredEquivalents } = useSavings();
  const { id: phraseId, text: phraseText, markUsed: markPhraseUsed } = useMotivationPhrase('daily');
  const addSavedPhraseId = useUserStore((s) => s.addSavedPhraseId);
  const savedPhraseIds = useUserStore((s) => s.savedPhraseIds);
  const isPhraseBookmarked = savedPhraseIds.includes(phraseId);
  const { next, progress } = useMilestones();
  const { unlocked } = useBehaviorBadges();
  const health = useHealthStats();
  const { emoji: levelEmoji, level } = useUserLevel();
  const productType = profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const avoided = getAvoidedCigarettes(profile?.lastCigaretteAt, profile?.cigarettesPerDay, productType);

  useEffect(() => {
    const nextMilestone = next;
    const pct = Math.round(progress * 100);

    updateWidgetSnapshot({
      smokeFreeDays: counter.days,
      moneySaved,
      cigarettesAvoided: avoided,
      nextMilestoneLabel: nextMilestone?.labelFr ?? '—',
      nextMilestonePercent: pct,
    }).catch(() => undefined);
  }, [counter.days, moneySaved, avoided, next, progress]);

  const nextHealthDelay = useMemo(
    () => formatTimeUntil(health.next.targetMs, counter.totalMs),
    [counter.totalMs, health.next.targetMs],
  );
  const nextMilestoneDelay = useMemo(
    () => formatTimeUntil(next.targetMs, counter.totalMs),
    [counter.totalMs, next.targetMs],
  );

  const activeRewardGoal = useMemo(
    () => rewardGoals.find((g) => !celebratedRewardGoalIds.includes(g.id)) ?? rewardGoals[0] ?? null,
    [rewardGoals, celebratedRewardGoalIds],
  );
  const rewardProgress =
    activeRewardGoal && activeRewardGoal.amount > 0
      ? Math.min(moneySaved / activeRewardGoal.amount, 1)
      : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 14 }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppLogo size="header" />
          <View
            style={{
              borderRadius: RADII.full,
              borderWidth: 0.5,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              paddingHorizontal: 8,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 10 }}>{levelEmoji}</Text>
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 10 }]}>Niv. {level}</Text>
          </View>
          <View
            style={{
              borderRadius: RADII.full,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              backgroundColor: colors.bgCard,
              paddingHorizontal: 8,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Flame color={colors.textMuted} size={11} strokeWidth={1.5} />
            <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 10 }]}>{appOpenStreak}j</Text>
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

      {/* Compteur smoke-free */}
      <Card style={{ backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 4 }}>
        <CounterSection
          days={counter.days}
          hours={counter.hours}
          minutes={counter.minutes}
          seconds={counter.seconds}
          onRelapsePress={() => router.push('/relapse')}
        />
      </Card>

      {/* Phrase de motivation */}
      <Pressable onPress={() => router.push(`/motivation?trigger=daily&streak=${appOpenStreak}` as Href)}>
        <Card
          style={{
            borderRadius: 13,
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 8,
            borderColor: colors.accentBorder,
            backgroundColor: colors.accentBg,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Text
              style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12, lineHeight: 18, flex: 1 }]}
              numberOfLines={3}
            >
              {phraseText}
            </Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                addSavedPhraseId(phraseId);
                markPhraseUsed();
              }}
              hitSlop={8}
            >
              <Bookmark
                size={15}
                color={isPhraseBookmarked ? colors.accent : 'rgba(167,139,250,0.45)'}
                strokeWidth={1.5}
                fill={isPhraseBookmarked ? colors.accent : 'transparent'}
              />
            </Pressable>
          </View>
          <Text style={[FONTS.bold, { color: colors.accent, fontSize: 10, opacity: 0.7 }]}>Lire plus →</Text>
        </Card>
      </Pressable>

      {/* Cagnotte */}
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
        <Text style={[FONTS.bold, { color: colors.emerald, opacity: 0.65, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' }]}>
          {i18n.t('home.moneySaved')}
        </Text>
        <Text style={[FONTS.black, { fontSize: 22, color: colors.emerald }]}>{moneySavedFormatted}</Text>
        <Animated.Text
          key={`${equivalent.emoji}-${equivalent.labelFr}`}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(220)}
          style={[FONTS.regular, { fontSize: 10, color: colors.emerald, opacity: 0.6, fontStyle: 'italic' }]}
        >
          {productConfig.emoji} {equivalent.labelFr}
        </Animated.Text>
        {filteredEquivalents.length > 1 && (
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {filteredEquivalents.slice(0, 4).map((item) => (
              <View
                key={item.emoji}
                style={{
                  borderRadius: RADII.full,
                  borderWidth: 0.5,
                  borderColor: 'rgba(16,185,129,0.25)',
                  backgroundColor: 'rgba(16,185,129,0.08)',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 9 }}>{item.emoji}</Text>
                <Text style={[FONTS.regular, { color: colors.emerald, fontSize: 9, opacity: 0.8 }]}>{item.labelFr}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* SOS — CTA principal, pleine largeur */}
      <Pressable onPress={() => router.push('/sos')}>
        <View
          style={{
            backgroundColor: colors.accent,
            borderRadius: 18,
            paddingHorizontal: 20,
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap color="#fff" size={26} strokeWidth={2} fill="#fff" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[FONTS.black, { color: '#fff', fontSize: 18 }]}>
              {i18n.t('home.openSos')}
            </Text>
            <Text style={[FONTS.regular, { color: 'rgba(255,255,255,0.75)', fontSize: 12 }]}>
              Technique de respiration · 3 min
            </Text>
          </View>
          <Text style={[FONTS.black, { color: 'rgba(255,255,255,0.8)', fontSize: 22 }]}>→</Text>
        </View>
      </Pressable>

      {/* Objectif cagnotte — compact pleine largeur */}
      <Pressable onPress={() => router.push('/reward' as Href)}>
        <Card style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
              {i18n.t('home.rewardGoalLabel')}
            </Text>
            {activeRewardGoal ? (
              <Text style={[FONTS.black, { color: colors.accent, fontSize: 13 }]}>
                {Math.round(rewardProgress * 100)}%
              </Text>
            ) : null}
          </View>
          {activeRewardGoal ? (
            <>
              <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]} numberOfLines={1}>
                {activeRewardGoal.label}
              </Text>
              <View
                style={{
                  height: 5,
                  borderRadius: RADII.full,
                  backgroundColor: colors.dividerStrong,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(rewardProgress * 100, 4)}%`,
                    height: 5,
                    borderRadius: RADII.full,
                    backgroundColor: colors.accent,
                  }}
                />
              </View>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>
                {moneySavedFormatted} / {activeRewardGoal.amount} {profile?.currency ?? 'CHF'}
              </Text>
            </>
          ) : (
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11 }]}>
              Ajouter un objectif de récompense →
            </Text>
          )}
        </Card>
      </Pressable>

      {/* Défi hebdomadaire */}
      {weeklyChallenge && (
        <Card style={{ borderRadius: 13, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 13 }}>🏆</Text>
              <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' }]}>
                Défi de la semaine
              </Text>
            </View>
            {weeklyChallenge.current >= weeklyChallenge.target && (
              <Text style={{ fontSize: 12 }}>✅</Text>
            )}
          </View>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]} numberOfLines={2}>
            {weeklyChallenge.label}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                flex: 1,
                height: 4,
                borderRadius: RADII.full,
                backgroundColor: colors.dividerStrong,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${Math.max(Math.min((weeklyChallenge.current / weeklyChallenge.target) * 100, 100), 4)}%`,
                  height: 4,
                  borderRadius: RADII.full,
                  backgroundColor: weeklyChallenge.current >= weeklyChallenge.target ? colors.emerald : colors.accent,
                }}
              />
            </View>
            <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 10 }]}>
              {weeklyChallenge.current}/{weeklyChallenge.target}
            </Text>
          </View>
        </Card>
      )}

      {/* Prochain palier + Santé — 2 cols */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        {/* Prochain palier */}
        <Pressable onPress={() => router.push(`/milestone/${next.id}`)} style={{ flex: 1 }}>
          <Card style={{ gap: 10, flex: 1, height: '100%' }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
              Prochain palier
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
              <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 12, flex: 1 }]} numberOfLines={2}>
                {next.labelFr}
              </Text>
            </View>
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
                  width: `${Math.max(progress * 100, 4)}%`,
                  height: 3,
                  borderRadius: RADII.full,
                  backgroundColor: colors.accent,
                }}
              />
            </View>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
              Dans {nextMilestoneDelay}
            </Text>
          </Card>
        </Pressable>

        {/* Santé */}
        <Pressable onPress={() => router.push('/stats')} style={{ flex: 1 }}>
          <Card style={{ gap: 10, flex: 1, height: '100%' }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
              {i18n.t('home.healthTeaser')}
            </Text>
            <View style={{ gap: 2 }}>
              <Text style={[FONTS.black, { color: colors.accent, fontSize: 20 }]}>{nextHealthDelay}</Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
                prochain bénéfice
              </Text>
            </View>
            <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 11 }]} numberOfLines={2}>
              {health.next.labelFr}
            </Text>
            <Text style={[FONTS.regular, { color: colors.accent, fontSize: 9, opacity: 0.7 }]}>
              Voir tout →
            </Text>
          </Card>
        </Pressable>
      </View>

      {/* Zen + Stats rapides — 2 cols */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        <Pressable onPress={() => router.push('/zen')} style={{ flex: 1 }}>
          <Card style={{ gap: 8, flex: 1, height: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 22 }}>🧘</Text>
              <View
                style={{
                  borderRadius: RADII.full,
                  backgroundColor: colors.emeraldBg,
                  borderWidth: 0.5,
                  borderColor: colors.emeraldBorder,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Wind size={9} color={colors.emerald} strokeWidth={1.5} />
                <Text style={[FONTS.bold, { color: colors.emerald, fontSize: 8 }]}>
                  {zenSessionsCompleted}
                </Text>
              </View>
            </View>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 14 }]}>
              {i18n.t('zen.homeTitle')}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]} numberOfLines={2}>
              {i18n.t('zen.homeBody')}
            </Text>
          </Card>
        </Pressable>

        {/* Stats rapides */}
        <Card style={{ flex: 1, gap: 8, height: '100%' }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
            En chiffres
          </Text>
          <View style={{ gap: 10 }}>
            <View>
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20 }]}>{avoided}</Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
                {i18n.t(`products.${productType}.avoidedLabel`)}
              </Text>
            </View>
            <View style={{ height: 0.5, backgroundColor: colors.divider }} />
            <View>
              <Text style={[FONTS.black, { color: colors.accent, fontSize: 20 }]}>{cravingsHandled}</Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
                {i18n.t('home.cravingsHandled')}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Badges comportementaux — si débloqués */}
      {unlocked.length > 0 ? (
        <Card style={{ gap: 10 }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
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
