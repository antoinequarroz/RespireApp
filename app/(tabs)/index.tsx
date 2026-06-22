import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CounterSection } from '@/components/sections/CounterSection';
import { AppLogo } from '@/components/ui/AppLogo';
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
  const cravingsHandled = useProgressStore((state) => state.cravingsHandled);
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
        <AppLogo size="header" />
        <Pressable
          onPress={() => router.push('/settings/notifications')}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgSurface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="notifications-outline" size={15} color={colors.accent} />
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
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 6,
        }}
      >
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
        <Text style={[FONTS.black, { fontSize: 20, color: colors.emerald }]}>{moneySavedFormatted}</Text>
        <Text style={[FONTS.regular, { fontSize: 9, color: colors.emerald, opacity: 0.75 }]}>
          {equivalent.emoji} {equivalent.labelFr}
        </Text>
      </Card>

      <Pressable
        onPress={() => router.push('/sos')}
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
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: RADII.full,
            backgroundColor: '#FF4D6D',
          }}
        />
        <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>{i18n.t('home.openSos')}</Text>
      </Pressable>

      <Pressable onPress={() => router.push(`/milestone/${next.id}`)}>
        <Card
          style={{
            backgroundColor: colors.bgSurface,
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
              backgroundColor: colors.accentBg,
              borderWidth: 1.5,
              borderColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 13 }}>🏆</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 10, marginBottom: 4 }]}>
              Badge {next.labelFr}
            </Text>
            <View
              style={{
                height: 3,
                borderRadius: RADII.full,
                backgroundColor: 'rgba(167,139,250,0.12)',
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
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/stats')}>
        <Card style={{ gap: 12, backgroundColor: colors.bgSurface }}>
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

          <Text style={[FONTS.regular, { color: colors.accent, fontSize: 12 }]}>{health.next.labelFr}</Text>
        </Card>
      </Pressable>

      <Card style={{ gap: 12, backgroundColor: colors.bgSurface }}>
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
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>{counter.days}j</Text>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 9, marginTop: 4 }]}>
              {i18n.t('home.currentStreak')}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
