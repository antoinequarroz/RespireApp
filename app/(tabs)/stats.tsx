import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

type RangeKey = '7d' | '30d' | 'total';

function buildPath(points: { x: number; y: number }[]) {
  const maxY = Math.max(...points.map((point) => point.y), 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 300;
      const y = 120 - (point.y / maxY) * 100;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

export default function StatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const savings = useSavings();
  const milestones = useMilestones();
  const health = useHealthStats();
  const [range, setRange] = useState<RangeKey>('30d');
  const avoided = getAvoidedCigarettes(profile?.lastCigaretteAt, profile?.cigarettesPerDay ?? 0);
  const packsAvoided = avoided / 20;
  const tobaccoGrams = avoided;

  const rangeSeries = useMemo(() => {
    if (range === '7d') {
      return savings.series.slice(-7);
    }
    return savings.series;
  }, [range, savings.series]);

  const rangeAmount = useMemo(() => {
    if (!profile) {
      return formatCurrency(0);
    }

    const daily = (profile.packPrice / 20) * profile.cigarettesPerDay;

    if (range === '7d') {
      return formatCurrency(daily * 7);
    }
    if (range === '30d') {
      return formatCurrency(daily * 30);
    }

    return savings.moneySavedFormatted;
  }, [profile, range, savings.moneySavedFormatted]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ gap: 6 }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
          {i18n.t('statsScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary }]}>
          {i18n.t('statsScreen.subtitle')}
        </Text>
      </View>

      <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
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
              {i18n.t('statsScreen.savingsCurve')}
            </Text>
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, marginTop: 6 }]}>
              {rangeAmount}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              borderRadius: RADII.full,
              backgroundColor: colors.bgCard,
              padding: 4,
            }}
          >
            {[
              { key: '7d', label: i18n.t('statsScreen.weekly') },
              { key: '30d', label: i18n.t('statsScreen.monthly') },
              { key: 'total', label: i18n.t('statsScreen.total') },
            ].map((item) => {
              const active = range === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setRange(item.key as RangeKey)}
                  style={{
                    borderRadius: RADII.full,
                    backgroundColor: active ? colors.accentBg : 'transparent',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    style={[
                      active ? FONTS.bold : FONTS.regular,
                      { color: active ? colors.accent : colors.textSecondary, fontSize: 11 },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Svg width="100%" height={140} viewBox="0 0 300 120">
          <Path d={buildPath(rangeSeries)} stroke={colors.accent} strokeWidth={4} fill="none" />
        </Svg>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card style={{ flex: 1, gap: 6, backgroundColor: colors.bgSurface }}>
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
            {i18n.t('home.avoided')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>{avoided}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
            {packsAvoided.toFixed(1)} {i18n.t('statsScreen.packsAvoided')} - {tobaccoGrams} g {i18n.t('statsScreen.tobacco')}
          </Text>
        </Card>

        <Card
          style={{
            flex: 1,
            backgroundColor: colors.emeraldBg,
            borderColor: colors.emeraldBorder,
            borderWidth: 1,
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
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              },
            ]}
          >
            {i18n.t('statsScreen.equivalents')}
          </Text>
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 22 }]}>{savings.equivalent.emoji}</Text>
          <Text style={[FONTS.regular, { color: colors.emerald, fontSize: 11, opacity: 0.8 }]}>
            {savings.equivalent.labelFr}
          </Text>
        </Card>
      </View>

      <Card style={{ gap: SPACING.md, backgroundColor: colors.bgSurface }}>
        <View style={{ gap: 4 }}>
          <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
            {i18n.t('statsScreen.healthTimeline')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary }]}>
            {i18n.t('statsScreen.healthSubtitle')}
          </Text>
        </View>

        <View style={{ gap: SPACING.sm }}>
          {health.timeline.map((item) => {
            const isNext = item.key === health.next.key && !item.reached;

            return (
              <View
                key={item.key}
                style={{
                  borderRadius: 12,
                  borderWidth: 0.5,
                  borderColor: isNext ? colors.accentBorder : colors.bgCardBorder,
                  backgroundColor: isNext ? colors.accentBg : colors.bgCard,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: RADII.full,
                    borderWidth: 1,
                    borderColor: item.reached ? colors.emeraldBorder : colors.accentBorder,
                    backgroundColor: item.reached ? colors.emeraldBg : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={[FONTS.bold, { color: item.reached ? colors.emerald : colors.accent, fontSize: 9 }]}>
                    {item.reached ? '✓' : '·'}
                  </Text>
                </View>
                <Text style={[FONTS.regular, { flex: 1, color: colors.textPrimary, fontSize: 13 }]}>
                  {item.labelFr}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={{ gap: SPACING.md, backgroundColor: colors.bgSurface }}>
        <View style={{ gap: 4 }}>
          <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
            {i18n.t('statsScreen.badgesTitle')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary }]}>
            {i18n.t('statsScreen.badgesSubtitle')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {milestones.milestones.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => item.reached && router.push(`/milestone/${item.id}`)}
              style={{
                width: '47%',
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: item.reached ? colors.accentBorder : colors.bgCardBorder,
                backgroundColor: item.reached ? colors.accentBg : colors.bgCard,
                paddingHorizontal: 12,
                paddingVertical: 14,
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.reached ? '🏅' : '○'}</Text>
              <Text
                style={[
                  FONTS.bold,
                  { color: item.reached ? colors.textPrimary : colors.textSecondary, fontSize: 13 },
                ]}
              >
                {item.labelFr}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
