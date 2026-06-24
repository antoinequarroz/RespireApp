import { type Href, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BreathingExercise } from '@/components/domain/BreathingExercise';
import { DistractionGame } from '@/components/domain/DistractionGame';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useSos } from '@/hooks/useSos';
import { useTheme } from '@/hooks/useTheme';
import { canShowDailyMotivation, markMotivationShownToday } from '@/services/motivation';
import { useProgressStore } from '@/store/progressStore';

function formatCountdown(s: number) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function SosScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const { mode, setMode, sessionDone, completeSession, countdown, elapsedSeconds } = useSos();

  const handleClose = useCallback(() => {
    if (elapsedSeconds >= 60) {
      canShowDailyMotivation()
        .then((shouldShow) => {
          if (!shouldShow) { router.back(); return; }
          return markMotivationShownToday().then(() =>
            router.replace(
              `/motivation?trigger=sos&streak=${useProgressStore.getState().appOpenStreak}` as Href,
            ),
          );
        })
        .catch(() => router.back());
    } else {
      router.back();
    }
  }, [elapsedSeconds, router]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: fixed.sosBg }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Text style={[FONTS.black, { color: fixed.sos, fontSize: 14 }]}>Mode SOS</Text>
          {/* Countdown */}
          <Text style={[FONTS.bold, { color: countdown === 0 ? fixed.sos : 'rgba(255,255,255,0.35)', fontSize: 11 }]}>
            {countdown === 0 ? 'Temps écoulé' : formatCountdown(countdown)}
          </Text>
        </View>
        <Pressable
          onPress={handleClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} color={colors.textPrimary} strokeWidth={1.5} />
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <View style={{ width: 28, height: 3, borderRadius: RADII.full, backgroundColor: colors.dividerStrong }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          borderRadius: RADII.lg,
          borderWidth: 0.5,
          borderColor: colors.accentBorder,
          backgroundColor: 'rgba(255,255,255,0.04)',
          padding: 4,
        }}
      >
        {[
          { key: 'breathing', label: 'Respiration' },
          { key: 'game', label: 'Jeu de distraction' },
        ].map((item) => {
          const active = mode === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setMode(item.key as 'breathing' | 'game')}
              style={{
                flex: 1,
                minHeight: 42,
                borderRadius: RADII.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? 'rgba(124,58,237,0.18)' : 'transparent',
                borderWidth: active ? 1 : 0,
                borderColor: active ? 'rgba(167,139,250,0.35)' : 'transparent',
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

      {mode === 'breathing' ? (
        <BreathingExercise onComplete={completeSession} techniqueId="box" cycleCount={4} tone="sos" />
      ) : (
        <DistractionGame onComplete={completeSession} />
      )}

      {sessionDone ? (
        <Card
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderColor: colors.bgCardBorder,
            gap: 8,
          }}
        >
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            Tu as tenu. Bravo.
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            L'envie est passée. Chaque victoire compte.
          </Text>
          <Button label="Recommencer" onPress={() => router.replace('/sos')} />
          <Button label="Fermer" variant="secondary" onPress={handleClose} />
        </Card>
      ) : (
        <Pressable onPress={handleClose} style={{ paddingVertical: 4 }}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
            Terminer l'exercice
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
