import { type Href, useRouter } from 'expo-router';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremiumGate';
import { useTheme } from '@/hooks/useTheme';
import { getThirtyDayTrend } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useProgressStore } from '@/store/progressStore';

const NOTE_MAX = 300;

const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😄'];

function buildHeatmap(entries: ReturnType<typeof getThirtyDayTrend>['entries']) {
  return Array.from({ length: 90 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - index));
    const iso = date.toISOString().slice(0, 10);
    const match = entries.find((item) => item.date === iso);
    return { id: iso, mood: match?.mood ?? 0 };
  });
}

export default function JournalScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const canJournal = usePremiumGate('journal');
  const canInsights = usePremiumGate('journalInsights');
  const entries = useProgressStore((state) => state.journalEntries);
  const addJournalEntry = useProgressStore((state) => state.addJournalEntry);
  const today = new Date().toISOString().slice(0, 10);
  const existingEntry = entries.find((item) => item.date === today);
  const [mood, setMood] = useState(existingEntry?.mood ?? 3);
  const [craving, setCraving] = useState(existingEntry?.craving ?? 2);
  const [note, setNote] = useState(existingEntry?.note ?? '');

  // Auto-save on each change (overwriting same entry)
  useEffect(() => {
    if (!canJournal) return;
    addJournalEntry({
      id: existingEntry?.id ?? `entry-${today}`,
      date: today,
      mood,
      craving,
      note,
    });
  }, [addJournalEntry, canJournal, craving, existingEntry?.id, mood, note, today]);

  const trend = useMemo(() => getThirtyDayTrend(entries), [entries]);
  const heatmap = useMemo(() => buildHeatmap(trend.entries), [trend.entries]);

  // Insights
  const insights = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const last7 = sorted.slice(-7);
    const prev7 = sorted.slice(-14, -7);
    const avgMood7 = last7.length ? last7.reduce((s, e) => s + e.mood, 0) / last7.length : 0;
    const avgMoodPrev = prev7.length ? prev7.reduce((s, e) => s + e.mood, 0) / prev7.length : 0;
    const avgCraving7 = last7.length ? last7.reduce((s, e) => s + e.craving, 0) / last7.length : 0;
    const moodTrend: 'up' | 'down' | 'stable' =
      avgMood7 - avgMoodPrev > 0.4 ? 'up' : avgMoodPrev - avgMood7 > 0.4 ? 'down' : 'stable';

    // Best mood day
    const bestDay = last7.length ? last7.reduce((a, b) => (a.mood >= b.mood ? a : b)) : null;

    return { avgMood7, avgCraving7, moodTrend, bestDay, totalEntries: entries.length };
  }, [entries]);

  if (!canJournal) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bgPrimary,
          paddingHorizontal: 20,
          paddingTop: 52,
          gap: 16,
        }}
      >
        <View style={{ gap: 6 }}>
          <AppLogo size="header" />
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('journalScreen.title')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('journalScreen.subtitle')}
          </Text>
        </View>

        <Card
          style={{
            gap: 14,
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 28, textAlign: 'center' }}>📓</Text>
          <Text
            style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, textAlign: 'center' }]}
          >
            {i18n.t('journalScreen.lockedTitle')}
          </Text>
          <Text
            style={[
              FONTS.regular,
              { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
            ]}
          >
            {i18n.t('journalScreen.lockedBody')}
          </Text>
          <Button label="Passer à PRO" onPress={() => router.push('/paywall' as Href)} />
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: SPACING.xxl,
        gap: 16,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 6 }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('journalScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('journalScreen.subtitle')}
        </Text>
      </View>

      {/* Entrée du jour */}
      <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
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
            Aujourd'hui · {today}
          </Text>
          {existingEntry && (
            <Text style={[FONTS.regular, { color: colors.emerald, fontSize: 9 }]}>
              ✓ sauvegardé
            </Text>
          )}
        </View>

        {/* Humeur */}
        <View style={{ gap: 8 }}>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('journalScreen.mood')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {MOOD_EMOJIS.map((emoji, index) => {
              const value = index + 1;
              const active = mood === value;
              return (
                <Pressable
                  key={emoji}
                  onPress={() => setMood(value)}
                  style={{
                    flex: 1,
                    minHeight: 52,
                    borderRadius: RADII.md,
                    borderWidth: 1,
                    borderColor: active ? colors.accentBorder : colors.bgCardBorder,
                    backgroundColor: active ? colors.accentBg : colors.bgCard,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{emoji}</Text>
                  {active && (
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.accent,
                      }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Intensité envie */}
        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
              {i18n.t('journalScreen.craving')}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>
              {craving === 1
                ? 'Aucune'
                : craving === 2
                  ? 'Légère'
                  : craving === 3
                    ? 'Modérée'
                    : craving === 4
                      ? 'Forte'
                      : 'Intense'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((value) => {
              const active = craving === value;
              const isHigh = value >= 4;
              return (
                <Pressable
                  key={value}
                  onPress={() => setCraving(value)}
                  style={{
                    flex: 1,
                    minHeight: 38,
                    borderRadius: RADII.md,
                    borderWidth: 1,
                    borderColor: active
                      ? isHigh
                        ? 'rgba(239,68,68,0.5)'
                        : colors.accentBorder
                      : colors.bgCardBorder,
                    backgroundColor: active
                      ? isHigh
                        ? 'rgba(239,68,68,0.10)'
                        : colors.accentBg
                      : colors.bgCard,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={[
                      FONTS.bold,
                      {
                        color: active ? (isHigh ? '#EF4444' : colors.accent) : colors.textPrimary,
                        fontSize: 13,
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Note */}
        <View style={{ gap: 6 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
              {i18n.t('journalScreen.note')}
            </Text>
            <Text
              style={[
                FONTS.regular,
                {
                  color: note.length > NOTE_MAX * 0.85 ? colors.accent : colors.textMuted,
                  fontSize: 10,
                },
              ]}
            >
              {note.length}/{NOTE_MAX}
            </Text>
          </View>
          <TextInput
            value={note}
            onChangeText={(v) => setNote(v.slice(0, NOTE_MAX))}
            multiline
            placeholder={i18n.t('journalScreen.placeholder')}
            placeholderTextColor={colors.textMuted}
            style={[
              FONTS.regular,
              {
                minHeight: 112,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.bgCard,
                color: colors.textPrimary,
                fontSize: 13,
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlignVertical: 'top',
              },
            ]}
          />
        </View>
      </Card>

      {/* Insights (PRO gate) */}
      {canInsights ? (
        <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>
              Tendances 7 jours
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {insights.moodTrend === 'up' ? (
                <TrendingUp size={16} color={colors.emerald} strokeWidth={1.5} />
              ) : insights.moodTrend === 'down' ? (
                <TrendingDown size={16} color="#EF4444" strokeWidth={1.5} />
              ) : (
                <Minus size={16} color={colors.textMuted} strokeWidth={1.5} />
              )}
              <Text
                style={[
                  FONTS.bold,
                  {
                    color:
                      insights.moodTrend === 'up'
                        ? colors.emerald
                        : insights.moodTrend === 'down'
                          ? '#EF4444'
                          : colors.textMuted,
                    fontSize: 11,
                  },
                ]}
              >
                {insights.moodTrend === 'up'
                  ? 'En amélioration'
                  : insights.moodTrend === 'down'
                    ? 'En baisse'
                    : 'Stable'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              {
                label: 'Humeur moy.',
                value: `${insights.avgMood7.toFixed(1)}/5`,
                color: colors.accent,
                emoji: MOOD_EMOJIS[Math.round(insights.avgMood7) - 1] ?? '😐',
              },
              {
                label: 'Envie moy.',
                value: `${insights.avgCraving7.toFixed(1)}/5`,
                color: insights.avgCraving7 >= 4 ? '#EF4444' : colors.emerald,
                emoji: insights.avgCraving7 >= 4 ? '🔥' : '✅',
              },
              {
                label: 'Entrées',
                value: String(insights.totalEntries),
                color: colors.textPrimary,
                emoji: '📓',
              },
            ].map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  borderRadius: RADII.md,
                  backgroundColor: colors.bgCard,
                  borderWidth: 0.5,
                  borderColor: colors.bgCardBorder,
                  padding: 10,
                  gap: 4,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 18 }}>{stat.emoji}</Text>
                <Text style={[FONTS.black, { color: stat.color, fontSize: 14 }]}>{stat.value}</Text>
                <Text
                  style={[
                    FONTS.regular,
                    { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
                  ]}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {insights.bestDay && (
            <View
              style={{
                borderRadius: RADII.md,
                backgroundColor: colors.accentBg,
                borderWidth: 0.5,
                borderColor: colors.accentBorder,
                padding: 10,
                gap: 4,
              }}
            >
              <Text
                style={[
                  FONTS.bold,
                  {
                    color: colors.textMuted,
                    fontSize: 9,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                Meilleur jour cette semaine
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>
                  {MOOD_EMOJIS[(insights.bestDay.mood ?? 3) - 1]}
                </Text>
                <View>
                  <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
                    {new Date(insights.bestDay.date).toLocaleDateString('fr-CH', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Text>
                  {insights.bestDay.note ? (
                    <Text
                      style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}
                      numberOfLines={2}
                    >
                      {insights.bestDay.note}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          )}
        </Card>
      ) : (
        <Pressable onPress={() => router.push('/paywall' as Href)}>
          <Card
            style={{
              gap: 10,
              backgroundColor: colors.accentBg,
              borderColor: colors.accentBorder,
              borderWidth: 1,
              opacity: 0.8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 15 }]}>
                Insights & tendances
              </Text>
              <View
                style={{
                  borderRadius: RADII.full,
                  backgroundColor: colors.accent,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={[FONTS.bold, { color: '#fff', fontSize: 8 }]}>PRO</Text>
              </View>
            </View>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
              Analyse de ton humeur, évolution des envies, meilleurs jours. Déverrouille avec PRO.
            </Text>
          </Card>
        </Pressable>
      )}

      {/* Historique heatmap */}
      <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>
            {i18n.t('journalScreen.history')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>90 jours</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
          {heatmap.map((entry) => (
            <View
              key={entry.id}
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor:
                  entry.mood === 0 ? colors.bgCard : `rgba(124,58,237,${0.15 + entry.mood * 0.14})`,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: 'rgba(124,58,237,0.25)',
              }}
            />
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
              Humeur moy : {trend.averageMood.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: 'rgba(124,58,237,0.65)',
              }}
            />
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
              Envie moy : {trend.averageCraving.toFixed(1)}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
