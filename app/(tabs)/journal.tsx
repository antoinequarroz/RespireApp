import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { getThirtyDayTrend } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';
import { useProgressStore } from '@/store/progressStore';

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
  const isPremium = usePremiumStore((state) => state.isPremium);
  const entries = useProgressStore((state) => state.journalEntries);
  const addJournalEntry = useProgressStore((state) => state.addJournalEntry);
  const today = new Date().toISOString().slice(0, 10);
  const existingEntry = entries.find((item) => item.date === today);
  const [mood, setMood] = useState(existingEntry?.mood ?? 3);
  const [craving, setCraving] = useState(existingEntry?.craving ?? 2);
  const [note, setNote] = useState(existingEntry?.note ?? '');

  useEffect(() => {
    if (!isPremium) {
      return;
    }

    addJournalEntry({
      id: existingEntry?.id ?? `entry-${today}`,
      date: today,
      mood,
      craving,
      note,
    });
  }, [addJournalEntry, craving, existingEntry?.id, isPremium, mood, note, today]);

  const trend = useMemo(() => getThirtyDayTrend(entries), [entries]);
  const heatmap = useMemo(() => buildHeatmap(trend.entries), [trend.entries]);

  if (!isPremium) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingHorizontal: 20, paddingTop: 52 }}>
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
            marginTop: 24,
            gap: 12,
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
            borderWidth: 1,
          }}
        >
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('journalScreen.lockedTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('journalScreen.lockedBody')}
          </Text>
          <Button label={i18n.t('common.premium')} onPress={() => router.push('/paywall')} />
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
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

      <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
        <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
          {today}
        </Text>

        <View>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('journalScreen.mood')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {[':-(', ':(', ':|', ':)', ':D'].map((emoji, index) => {
              const value = index + 1;
              const active = mood === value;
              return (
                <Pressable
                  key={emoji}
                  onPress={() => setMood(value)}
                  style={{
                    flex: 1,
                    minHeight: 48,
                    borderRadius: RADII.md,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.bgCardBorder,
                    backgroundColor: active ? colors.accentBg : colors.bgCard,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={[FONTS.bold, { color: active ? colors.accent : colors.textPrimary, fontSize: 16 }]}>
                    {emoji}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('journalScreen.craving')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {[1, 2, 3, 4, 5].map((value) => {
              const active = craving === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setCraving(value)}
                  style={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: RADII.md,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.bgCardBorder,
                    backgroundColor: active ? colors.accentBg : colors.bgCard,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={[FONTS.bold, { color: active ? colors.accent : colors.textPrimary, fontSize: 13 }]}>
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('journalScreen.note')}
          </Text>
          <TextInput
            value={note}
            onChangeText={(value) => setNote(value.slice(0, 150))}
            multiline
            placeholder={i18n.t('journalScreen.placeholder')}
            placeholderTextColor={colors.textMuted}
            style={[
              FONTS.regular,
              {
                minHeight: 112,
                marginTop: 10,
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

      <Card style={{ gap: 14, backgroundColor: colors.bgSurface }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('journalScreen.history')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {heatmap.map((entry) => (
            <View
              key={entry.id}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                backgroundColor: entry.mood === 0 ? colors.bgCard : `rgba(124,58,237,${0.18 + entry.mood * 0.13})`,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('journalScreen.mood')}: {trend.averageMood}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('journalScreen.craving')}: {trend.averageCraving}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
