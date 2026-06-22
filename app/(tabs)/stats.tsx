import { ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { MilestoneCard } from '@/components/domain/MilestoneCard';
import { SavingsEquivalent } from '@/components/domain/SavingsEquivalent';
import { AppLogo } from '@/components/ui/AppLogo';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { getAvoidedCigarettes } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function buildPath(points: { x: number; y: number }[]) {
  const maxY = Math.max(...points.map((point) => point.y), 1);
  return points
    .map((point, index) => {
      const x = (point.x / (points.length - 1 || 1)) * 300;
      const y = 120 - (point.y / maxY) * 100;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const savings = useSavings();
  const milestones = useMilestones();
  const health = useHealthStats();
  const avoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay ?? 0,
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
          {i18n.t('statsScreen.title')}
        </Text>
      </View>

      <Card>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('statsScreen.savingsCurve')}
        </Text>
        <Svg width="100%" height={140} viewBox="0 0 300 120" style={{ marginTop: 12 }}>
          <Path d={buildPath(savings.series)} stroke={colors.accent} strokeWidth={4} fill="none" />
        </Svg>
      </Card>

      <View style={{ flexDirection: 'row', gap: SPACING.md }}>
        <Card style={{ flex: 1 }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9 }]}>
            {i18n.t('home.avoided')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, marginTop: 6 }]}>
            {avoided}
          </Text>
        </Card>
        <Card
          style={{
            flex: 1,
            backgroundColor: colors.emeraldBg,
            borderColor: colors.emeraldBorder,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.emerald, fontSize: 9, opacity: 0.6 }]}>
            {i18n.t('home.moneySaved')}
          </Text>
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 22, marginTop: 6 }]}>
            {savings.moneySavedFormatted}
          </Text>
        </Card>
      </View>

      <Card>
        <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
          {i18n.t('statsScreen.healthTimeline')}
        </Text>
        <View style={{ gap: SPACING.sm, marginTop: 12 }}>
          {health.timeline.map((item) => (
            <MilestoneCard key={item.key} label={item.labelFr} reached={item.reached} />
          ))}
        </View>
      </Card>

      <Card>
        <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
          {i18n.t('statsScreen.equivalents')}
        </Text>
        <View style={{ marginTop: 12 }}>
          <SavingsEquivalent emoji={savings.equivalent.emoji} label={savings.equivalent.labelFr} />
        </View>
      </Card>

      <Card>
        <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
          {i18n.t('home.nextMilestone')}
        </Text>
        <View style={{ gap: SPACING.sm, marginTop: 12 }}>
          {milestones.milestones.map((item) => (
            <MilestoneCard key={item.id} label={item.labelFr} reached={item.reached} />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
