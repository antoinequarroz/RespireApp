import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BreathingExercise } from '@/components/domain/BreathingExercise';
import { DistractionGame } from '@/components/domain/DistractionGame';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useSos } from '@/hooks/useSos';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

export default function SosScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const { mode, setMode, sessionDone, completeSession } = useSos();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: fixed.sosBg }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[FONTS.black, { color: fixed.sos, fontSize: 14 }]}>{i18n.t('sosScreen.title')}</Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <View
          style={{
            width: 28,
            height: 3,
            borderRadius: RADII.full,
            backgroundColor: colors.dividerStrong,
          }}
        />
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
          { key: 'breathing', label: i18n.t('sosScreen.breathing') },
          { key: 'game', label: i18n.t('sosScreen.game') },
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
            {i18n.t('sosScreen.doneTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('sosScreen.doneBody')}
          </Text>
          <Button label={i18n.t('sosScreen.restart')} onPress={() => router.replace('/sos')} />
          <Button label={i18n.t('common.close')} variant="secondary" onPress={() => router.back()} />
        </Card>
      ) : (
        <Text
          style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}
          onPress={() => router.back()}
        >
          {i18n.t('sosScreen.finishExercise')}
        </Text>
      )}
    </ScrollView>
  );
}
