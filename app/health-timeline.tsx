import { useRouter } from 'expo-router';
import { Award, CheckCircle2, Circle, X } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useHealthStats } from '@/hooks/useHealthStats';
import { useTheme } from '@/hooks/useTheme';
import { buildMilestoneDate } from '@/services/calculations';
import { useUserStore } from '@/store/userStore';

const HEALTH_EMOJI: Record<string, string> = {
  blood_pressure: '❤️',
  carbon_monoxide: '💨',
  heart_attack: '🛡️',
  smell_taste: '👃',
  circulation: '🩸',
  lungs: '🫁',
  fertility: '✨',
  breathing: '🏃',
  heart_disease: '💚',
  stroke: '🧠',
  lung_cancer: '🫁',
  heart_normal: '💚',
};

function formatTargetLabel(targetMs: number): string {
  const s = targetMs / 1000;
  const m = s / 60;
  const h = m / 60;
  const d = h / 24;
  const w = d / 7;
  const mo = d / 30.44;
  const y = d / 365.25;

  if (y >= 1) return `${Math.round(y)} an${Math.round(y) > 1 ? 's' : ''}`;
  if (mo >= 1) return `${Math.round(mo)} mois`;
  if (w >= 1) return `${Math.round(w)} sem.`;
  if (d >= 1) return `${Math.round(d)} j`;
  if (h >= 1) return `${Math.round(h)} h`;
  return `${Math.round(m)} min`;
}

function formatLifeGained(minutes: number): string | null {
  if (minutes <= 0) return null;
  if (minutes < 60) return `+${minutes} min de vie`;
  const h = Math.round(minutes / 60);
  if (h < 24) return `+${h}h de vie`;
  const d = Math.round(minutes / 1440);
  if (d < 365) return `+${d} jours de vie`;
  const y = Math.round(minutes / 525960);
  return `+${y} an${y > 1 ? 's' : ''} de vie`;
}

export default function HealthTimelineScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const health = useHealthStats();
  const profile = useUserStore((s) => s.profile);
  const counter = useCounter();

  const completedCount = health.timeline.filter((i) => i.reached).length;
  const totalCount = health.timeline.length;
  const progressRatio = totalCount === 0 ? 0 : completedCount / totalCount;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: SPACING.xxl,
        gap: 20,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ gap: 4, flex: 1, paddingRight: 12 }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase' }]}>
            Récupération du corps
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>
            Ta santé se régénère
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            Chaque heure sans tabac, ton corps se répare en silence.
          </Text>
        </View>
        <View
          onTouchEnd={() => router.back()}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X color={colors.textPrimary} size={18} strokeWidth={1.5} />
        </View>
      </View>

      {/* Progression globale */}
      <View
        style={{
          borderRadius: RADII.xl,
          backgroundColor: colors.bgCard,
          borderWidth: 0.5,
          borderColor: colors.bgCardBorder,
          padding: 16,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 11 }]}>
            Bénéfices atteints
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20 }]}>
            {completedCount}
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13 }]}>/{totalCount}</Text>
          </Text>
        </View>
        <View style={{ height: 8, borderRadius: RADII.full, backgroundColor: colors.dividerStrong, overflow: 'hidden' }}>
          <Animated.View
            style={{
              width: `${Math.max(progressRatio * 100, progressRatio > 0 ? 4 : 0)}%`,
              height: 8,
              borderRadius: RADII.full,
              backgroundColor: colors.emerald,
            }}
          />
        </View>
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>
          {Math.round(progressRatio * 100)}% du chemin vers la santé d'un non-fumeur
        </Text>
      </View>

      {/* Timeline */}
      <View style={{ gap: 10 }}>
        {health.timeline.map((item, index) => {
          const isNext = item.key === health.next.key && !item.reached;
          const isFuture = !item.reached && !isNext;
          const expectedDate = profile?.lastCigaretteAt
            ? buildMilestoneDate(profile.lastCigaretteAt, item.targetMs)
            : null;

          const formattedDate = expectedDate
            ? expectedDate.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' })
            : null;

          const lifeLabel = 'lifeGainedMin' in item ? formatLifeGained(item.lifeGainedMin as number) : null;

          return (
            <Animated.View
              key={item.key}
              entering={FadeInDown.delay(index * 35).duration(240)}
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: item.reached
                  ? 'rgba(16,185,129,0.25)'
                  : isNext
                  ? colors.accentBorder
                  : colors.bgCardBorder,
                backgroundColor: item.reached
                  ? 'rgba(16,185,129,0.06)'
                  : isNext
                  ? colors.accentBg
                  : colors.bgCard,
                paddingHorizontal: 14,
                paddingVertical: 14,
                gap: 10,
              }}
            >
              {/* Ligne du haut : icône + titre + badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 28, alignItems: 'center' }}>
                  {item.reached ? (
                    <CheckCircle2 size={22} color={colors.emerald} strokeWidth={1.5} />
                  ) : isNext ? (
                    <Award size={22} color={colors.accent} strokeWidth={1.5} />
                  ) : (
                    <Circle size={22} color={colors.textMuted} strokeWidth={1.5} />
                  )}
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 14 }}>{HEALTH_EMOJI[item.key] ?? '✨'}</Text>
                    <Text
                      style={[
                        FONTS.bold,
                        {
                          color: item.reached
                            ? colors.emerald
                            : isNext
                            ? colors.textPrimary
                            : colors.textSecondary,
                          fontSize: 13,
                          flex: 1,
                        },
                      ]}
                    >
                      {item.labelFr}
                    </Text>
                  </View>

                  {item.reached ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[FONTS.regular, { color: 'rgba(16,185,129,0.60)', fontSize: 10 }]}>
                        Atteint ✓
                      </Text>
                      {lifeLabel ? (
                        <View style={{
                          borderRadius: RADII.full,
                          backgroundColor: 'rgba(16,185,129,0.10)',
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                        }}>
                          <Text style={[FONTS.bold, { color: colors.emerald, fontSize: 9 }]}>{lifeLabel}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : isNext ? (
                    <View style={{ gap: 6, marginTop: 2 }}>
                      <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>
                        Dans {formatTargetLabel(item.targetMs - counter.totalMs)}
                        {formattedDate ? ` · le ${formattedDate}` : ''}
                      </Text>
                      {/* Mini barre */}
                      {(() => {
                        const prev = health.timeline[index - 1];
                        const start = prev ? prev.targetMs : 0;
                        const range = item.targetMs - start;
                        const elapsed = counter.totalMs - start;
                        const p = Math.min(Math.max(elapsed / range, 0), 1);
                        return (
                          <View style={{ height: 3, borderRadius: RADII.full, backgroundColor: colors.dividerStrong, overflow: 'hidden' }}>
                            <View style={{ width: `${Math.max(p * 100, 4)}%`, height: 3, borderRadius: RADII.full, backgroundColor: colors.accent }} />
                          </View>
                        );
                      })()}
                    </View>
                  ) : (
                    <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>
                      {formatTargetLabel(item.targetMs)}
                      {formattedDate ? ` · ${formattedDate}` : ''}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    borderRadius: RADII.full,
                    backgroundColor: item.reached
                      ? 'rgba(16,185,129,0.12)'
                      : isNext
                      ? colors.accentBg
                      : 'rgba(255,255,255,0.05)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={[FONTS.bold, { color: item.reached ? colors.emerald : isNext ? colors.accent : colors.textMuted, fontSize: 9 }]}>
                    {formatTargetLabel(item.targetMs)}
                  </Text>
                </View>
              </View>

              {/* Corps scientifique — visible si atteint ou prochain */}
              {'bodyFr' in item && (item.reached || isNext) ? (
                <View style={{
                  marginLeft: 42,
                  borderLeftWidth: 1.5,
                  borderLeftColor: item.reached ? 'rgba(16,185,129,0.20)' : colors.accentBorder,
                  paddingLeft: 10,
                }}>
                  <Text style={[FONTS.regular, { color: item.reached ? 'rgba(16,185,129,0.55)' : colors.textSecondary, fontSize: 11, lineHeight: 16 }]}>
                    {item.bodyFr as string}
                  </Text>
                </View>
              ) : null}
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}
