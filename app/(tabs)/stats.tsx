import { type Href, useRouter } from 'expo-router';
import { Award, CheckCircle2, Circle } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useBehaviorBadges } from '@/hooks/useBehaviorBadges';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

type RangeKey = '7d' | '30d' | 'total';

function buildPath(points: { x: number; y: number }[], maxY: number) {
  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 300;
      const y = 110 - (point.y / maxY) * 90;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

function buildLinearPath(points: number, dailyRate: number, maxY: number) {
  return Array.from({ length: points }, (_, i) => {
    const x = (i / Math.max(points - 1, 1)) * 300;
    const y = 110 - ((i * dailyRate) / maxY) * 90;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
}

export default function StatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const savings = useSavings();
  const milestones = useMilestones();
  const behaviorBadges = useBehaviorBadges();
  const health = useHealthStats();
  const [range, setRange] = useState<RangeKey>('30d');
  const productType = profile?.productType ?? 'cigarette';
  const productConfig = getProductConfig(productType);
  const avoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay ?? 0,
    productType,
  );
  const packageEquivalents = avoided / productConfig.unitsPerPrice;

  const rangeSeries = useMemo(() => {
    if (range === '7d') return savings.series.slice(-7);
    return savings.series;
  }, [range, savings.series]);

  const dailySavingsRate = useMemo(() => {
    if (!profile || profile.cigarettesPerDay <= 0 || profile.packPrice <= 0) return 0;
    const config = getProductConfig(profile.productType);
    const unitsPerDay =
      config.quantityCadence === 'day' ? profile.cigarettesPerDay : profile.cigarettesPerDay / 7;
    return (unitsPerDay / config.unitsPerPrice) * profile.packPrice;
  }, [profile]);

  const graphMaxY = useMemo(() => {
    const actualMax = Math.max(...rangeSeries.map((p) => p.y), 1);
    const linearMax = dailySavingsRate * rangeSeries.length;
    return Math.max(actualMax, linearMax, 1);
  }, [rangeSeries, dailySavingsRate]);

  const rangeAmount = useMemo(() => {
    if (!profile) {
      return formatCurrency(0, 'EUR');
    }

    const unitsPerDay =
      productConfig.quantityCadence === 'day'
        ? profile.cigarettesPerDay
        : profile.cigarettesPerDay / 7;
    const daily = (profile.packPrice / productConfig.unitsPerPrice) * unitsPerDay;

    if (range === '7d') {
      return formatCurrency(daily * 7, profile.currency);
    }
    if (range === '30d') {
      return formatCurrency(daily * 30, profile.currency);
    }

    return savings.moneySavedFormatted;
  }, [productConfig.quantityCadence, productConfig.unitsPerPrice, profile, range, savings.moneySavedFormatted]);

  const avoidedDetail = useMemo(() => {
    if (productType === 'rolling') {
      return `${packageEquivalents.toFixed(1)} ${i18n.t('statsScreen.tobaccoPouches')}`;
    }
    if (productType === 'pipe') {
      return `${packageEquivalents.toFixed(1)} ${i18n.t('statsScreen.pipePouches')}`;
    }
    return `${packageEquivalents.toFixed(1)} ${i18n.t(`products.${productType}.statsEquivalentLabel`)}`;
  }, [packageEquivalents, productType]);

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
          {/* Courbe "si tu n'avais pas arrêté" (dépenses) */}
          <Path
            d={buildLinearPath(rangeSeries.length, dailySavingsRate, graphMaxY)}
            stroke="rgba(239,68,68,0.35)"
            strokeWidth={2}
            strokeDasharray="6,4"
            fill="none"
          />
          {/* Courbe économies réelles */}
          <Path
            d={buildPath(rangeSeries, graphMaxY)}
            stroke={colors.emerald}
            strokeWidth={3}
            fill="none"
          />
          {/* Légende */}
          <SvgText x="4" y="14" fill={colors.emerald} fontSize="7" fontFamily="System">
            Économies
          </SvgText>
          <SvgText x="4" y="24" fill="rgba(239,68,68,0.60)" fontSize="7" fontFamily="System">
            Si tu n'avais pas arrêté
          </SvgText>
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
            {i18n.t(`products.${productType}.avoidedLabel`)}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>{avoided}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>{avoidedDetail}</Text>
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

      <Pressable onPress={() => router.push('/health-timeline' as Href)}>
        <Card style={{ gap: SPACING.md, backgroundColor: colors.bgSurface }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 4, flex: 1 }}>
              <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
                {i18n.t('statsScreen.healthTimeline')}
              </Text>
              <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary }]}>
                {i18n.t('statsScreen.healthSubtitle')}
              </Text>
            </View>
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11 }]}>Voir tout →</Text>
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
                {item.reached ? (
                  <CheckCircle2 size={18} color={colors.emerald} strokeWidth={1.5} />
                ) : isNext ? (
                  <Award size={18} color={colors.accent} strokeWidth={1.5} />
                ) : (
                  <Circle size={18} color={colors.textMuted} strokeWidth={1.5} />
                )}
                <Text style={[FONTS.regular, { flex: 1, color: colors.textPrimary, fontSize: 13 }]}>
                  {item.labelFr}
                </Text>
              </View>
            );
          })}
        </View>
        </Card>
      </Pressable>

      <Card style={{ gap: SPACING.md, backgroundColor: colors.bgSurface }}>
        <View style={{ gap: 4 }}>
          <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
            {i18n.t('statsScreen.behaviorBadges')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary }]}>
            {i18n.t('statsScreen.behaviorBadgesSubtitle')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {behaviorBadges.badges.map((item) => (
            <View
              key={item.id}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18, opacity: item.reached ? 1 : 0.3 }}>
                  {item.emoji ?? '⭐'}
                </Text>
                <Text
                  style={[
                    FONTS.bold,
                    { color: item.reached ? colors.textPrimary : colors.textSecondary, fontSize: 13 },
                  ]}
                >
                  {item.labelFr}
                </Text>
              </View>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
                {item.descriptionFr}
              </Text>
            </View>
          ))}
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
              <Text style={{ fontSize: 18, opacity: item.reached ? 1 : 0.25 }}>🏆</Text>
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
