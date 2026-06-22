import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CounterSection } from '@/components/sections/CounterSection';
import { HealthSection } from '@/components/sections/HealthSection';
import { MilestonesSection } from '@/components/sections/MilestonesSection';
import { SavingsSection } from '@/components/sections/SavingsSection';
import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { updateWidgetSnapshot } from '@/services/widget';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent } = useSavings();
  const { next, progress, unlocked } = useMilestones();
  const health = useHealthStats();

  useEffect(() => {
    updateWidgetSnapshot({ smokeFreeDays: counter.days, moneySaved }).catch(() => undefined);
  }, [counter.days, moneySaved]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          Tu reprends du terrain.
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('app.tagline')}
        </Text>
      </View>

      <CounterSection
        value={`${counter.days}j ${counter.hours}h ${counter.minutes}m ${counter.seconds}s`}
      />

      <View style={{ flexDirection: 'row', gap: SPACING.md }}>
        <Card
          style={{
            flex: 1,
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
          }}
        >
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
            Serie
          </Text>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 22, marginTop: 6 }]}>
            {counter.days}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 9, marginTop: 4 }]}>
            jours complets
          </Text>
        </Card>

        <Card
          style={{
            flex: 1,
            backgroundColor: colors.bgSurface,
          }}
        >
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
            Badges
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, marginTop: 6 }]}>
            {unlocked.length}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 9, marginTop: 4 }]}>
            milestones valides
          </Text>
        </Card>
      </View>

      <SavingsSection
        amount={moneySavedFormatted}
        equivalentLabel={equivalent.labelFr}
        equivalentEmoji={equivalent.emoji}
      />

      <Card
        style={{
          backgroundColor: colors.bgSurface,
          gap: 10,
        }}
      >
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
          Focus du moment
        </Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {next.labelFr}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          Encore un cap propre et ta serie devient beaucoup plus solide.
        </Text>
        <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: 4 }}>
          <Button
            label={i18n.t('home.openSos')}
            variant="sos"
            style={{ flex: 1 }}
            onPress={() => router.push('/sos')}
          />
          <Button
            label={i18n.t('home.openStats')}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => router.push('/stats')}
          />
        </View>
      </Card>

      <MilestonesSection nextLabel={next.labelFr} progress={progress} />

      <HealthSection
        progress={health.progressRatio}
        nextLabel={health.next.labelFr}
        completed={health.completed}
      />

      <Card>
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
          Tu recuperes deja
        </Text>
        <View style={{ gap: 10, marginTop: 12 }}>
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
        </View>
      </Card>
    </ScrollView>
  );
}
