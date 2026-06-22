import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CounterSection } from '@/components/sections/CounterSection';
import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { updateWidgetSnapshot } from '@/services/widget';
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
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent } = useSavings();
  const { next, progress } = useMilestones();
  const health = useHealthStats();
  const cigarettesAvoided = getAvoidedCigarettes(profile?.lastCigaretteAt, profile?.cigarettesPerDay);

  useEffect(() => {
    updateWidgetSnapshot({ smokeFreeDays: counter.days, moneySaved }).catch(() => undefined);
  }, [counter.days, moneySaved]);

  const nextHealthDelay = useMemo(
    () => formatTimeUntil(health.next.targetMs, counter.totalMs),
    [counter.totalMs, health.next.targetMs],
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View
        style={{
          paddingTop: SPACING.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AppLogo size="header" />
        <Pressable
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: colors.accent,
            }}
          />
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
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 6,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.emerald,
                opacity: 0.6,
                fontSize: 8,
                letterSpacing: 1,
                textTransform: 'uppercase',
              },
            ]}
          >
            {i18n.t('home.moneySaved')}
          </Text>
          <Text style={[FONTS.bold, { color: colors.emerald, fontSize: 8 }]}>
            {i18n.t('home.equivalent')}
          </Text>
        </View>
        <Text style={[FONTS.black, { fontSize: 20, color: colors.emerald }]}>{moneySavedFormatted}</Text>
        <Text style={[FONTS.regular, { fontSize: 9, color: colors.emerald, opacity: 0.75 }]}>
          {equivalent.emoji} {equivalent.labelFr}
        </Text>
      </Card>

      <Button label={i18n.t('home.openSos')} variant="sos" onPress={() => router.push('/sos')} />

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
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
              {i18n.t('home.nextMilestone')}
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 6 }]}>
              {next.labelFr}
            </Text>
          </View>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>🏅</Text>
          </View>
        </View>

        <View
          style={{
            height: 3,
            borderRadius: RADII.full,
            backgroundColor: colors.dividerStrong,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.max(progress * 100, 6)}%`,
              height: 3,
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </Card>

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
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>
              {cigarettesAvoided}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11, marginTop: 4 }]}>
              {i18n.t('home.avoided')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 22 }]}>{nextHealthDelay}</Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11, marginTop: 4 }]}>
              {i18n.t('home.nextHealthBenefit')}
            </Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/stats')} style={{ paddingTop: 4 }}>
          <Text style={[FONTS.regular, { color: colors.accent, fontSize: 12 }]}>
            {health.next.labelFr}
          </Text>
        </Pressable>
      </Card>

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
          {i18n.t('home.recoveryTitle')}
        </Text>
        {health.timeline.slice(0, 3).map((item) => (
          <View
            key={item.key}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                marginTop: 5,
                backgroundColor: item.reached ? colors.accent : colors.dividerStrong,
              }}
            />
            <Text style={[FONTS.regular, { flex: 1, color: colors.textSecondary, fontSize: 13 }]}>
              {item.labelFr}
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
