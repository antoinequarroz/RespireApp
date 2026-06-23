import { type Href, useRouter } from 'expo-router';
import { Minus, Plus, RefreshCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { canShowDailyMotivation, markMotivationShownToday } from '@/services/motivation';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

export default function RelapseScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const addJournalEntry = useProgressStore((s) => s.addJournalEntry);
  const [cigaretteCount, setCigaretteCount] = useState<number | null>(null);

  const handleReset = (date: Date) => {
    if (!profile) { router.back(); return; }

    setProfile({ ...profile, lastCigaretteAt: date.toISOString() });

    // Auto journal entry
    const note = cigaretteCount != null
      ? `Rechute — ${cigaretteCount} cigarette${cigaretteCount > 1 ? 's' : ''}`
      : 'Rechute';
    addJournalEntry({ id: Date.now().toString(), date: new Date().toISOString(), mood: 2, craving: 5, note });

    canShowDailyMotivation()
      .then((shouldShow) => {
        if (!shouldShow) { router.back(); return; }
        return markMotivationShownToday().then(() =>
          router.replace(
            `/motivation?trigger=relapse&streak=${useProgressStore.getState().appOpenStreak}` as Href,
          ),
        );
      })
      .catch(() => router.back());
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(12, 10, 30, 0.72)', justifyContent: 'flex-end' }}>
      <Card
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: colors.bgSurface,
          borderColor: colors.bgCardBorder,
          gap: SPACING.md,
          paddingHorizontal: SPACING.lg,
          paddingTop: 14,
          paddingBottom: SPACING.xxl,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <View style={{ width: 30, height: 4, borderRadius: RADII.full, backgroundColor: colors.dividerStrong }} />
        </View>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: RADII.lg,
            backgroundColor: colors.accentBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCcw size={18} color={colors.accent} strokeWidth={1.5} />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16 }]}>
            On repart de zéro.
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
            Ce n'est pas un échec, c'est une étape. Chaque nouvelle tentative compte.
          </Text>
        </View>

        {/* Optional cigarette count stepper */}
        <View style={{ gap: 8 }}>
          <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 11 }]}>
            Combien as-tu fumé ? (facultatif)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Pressable
              onPress={() => setCigaretteCount((n) => Math.max(1, (n ?? 1) - 1))}
              style={{
                width: 38,
                height: 38,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: colors.divider,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Minus size={16} color={colors.textSecondary} strokeWidth={1.5} />
            </Pressable>

            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 22, flex: 1, textAlign: 'center' }]}>
              {cigaretteCount ?? '—'}
            </Text>

            <Pressable
              onPress={() => setCigaretteCount((n) => Math.min(20, (n ?? 0) + 1))}
              style={{
                width: 38,
                height: 38,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: colors.divider,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} color={colors.textSecondary} strokeWidth={1.5} />
            </Pressable>
          </View>
          {cigaretteCount != null && (
            <Pressable onPress={() => setCigaretteCount(null)}>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10, textAlign: 'center' }]}>
                Effacer
              </Text>
            </Pressable>
          )}
        </View>

        <Button label="Repartir maintenant" onPress={() => handleReset(new Date())} />
        <Button
          label="Repartir depuis ce matin"
          variant="secondary"
          onPress={() => {
            const morning = new Date();
            morning.setHours(0, 0, 0, 0);
            handleReset(morning);
          }}
        />

        <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
            Annuler
          </Text>
        </Pressable>
      </Card>
    </View>
  );
}
