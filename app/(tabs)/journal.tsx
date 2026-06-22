import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { getThirtyDayTrend } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { usePremiumStore } from '@/store/premiumStore';
import { useProgressStore } from '@/store/progressStore';

export default function JournalScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const isPremium = usePremiumStore((state) => state.isPremium);
  const entries = useProgressStore((state) => state.journalEntries);
  const addJournalEntry = useProgressStore((state) => state.addJournalEntry);
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(2);
  const [note, setNote] = useState('');

  if (!isPremium) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          gap: SPACING.xl,
          backgroundColor: colors.bgPrimary,
          paddingHorizontal: SPACING.xl,
        }}
      >
        <Card>
          <Text style={[FONTS.black, { fontSize: 18, color: colors.textPrimary }]}>
            {i18n.t('journalScreen.lockedTitle')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary, marginTop: 8 }]}>
            {i18n.t('journalScreen.lockedBody')}
          </Text>
        </Card>
        <Button label={i18n.t('common.premium')} onPress={() => router.push('/paywall')} />
      </View>
    );
  }

  const trend = getThirtyDayTrend(entries);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('journalScreen.title')}
        </Text>
      </View>

      <Card>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('journalScreen.subtitle')}
        </Text>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13, marginTop: 12 }]}>
          {i18n.t('journalScreen.mood')}: {mood}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              label={`${value}`}
              variant={mood === value ? 'primary' : 'secondary'}
              style={{ flex: 1 }}
              onPress={() => setMood(value)}
            />
          ))}
        </View>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13, marginTop: 12 }]}>
          {i18n.t('journalScreen.craving')}: {craving}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              label={`${value}`}
              variant={craving === value ? 'primary' : 'secondary'}
              style={{ flex: 1 }}
              onPress={() => setCraving(value)}
            />
          ))}
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          placeholder={i18n.t('journalScreen.placeholder')}
          placeholderTextColor={colors.textMuted}
          style={[
            FONTS.bold,
            {
              minHeight: 112,
              marginTop: 12,
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
        <Button
          label={i18n.t('common.save')}
          style={{ marginTop: 12 }}
          onPress={() =>
            addJournalEntry({
              id: Date.now().toString(),
              date: new Date().toISOString().slice(0, 10),
              mood,
              craving,
              note,
            })
          }
        />
      </Card>

      <Card>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('journalScreen.history')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {trend.entries.map((entry) => (
            <View
              key={entry.id}
              style={{
                width: 40,
                height: 40,
                borderRadius: RADII.sm,
                backgroundColor: `rgba(124,58,237,${0.15 + entry.mood / 6})`,
              }}
            />
          ))}
        </View>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, marginTop: 12 }]}>
          {i18n.t('journalScreen.mood')}: {trend.averageMood} | {i18n.t('journalScreen.craving')}:{' '}
          {trend.averageCraving}
        </Text>
      </Card>
    </ScrollView>
  );
}
