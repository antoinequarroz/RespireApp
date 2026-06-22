import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
      style={{ flex: 1, backgroundColor: colors.bgSos }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: fixed.sos,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('common.sos')}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 4 }}>
        <View
          style={{
            width: 28,
            height: 3,
            borderRadius: RADII.full,
            backgroundColor: colors.dividerStrong,
          }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('sosScreen.cravingTitle')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('sosScreen.cravingBody')}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          borderRadius: RADII.lg,
          borderWidth: 0.5,
          borderColor: colors.accentBorder,
          backgroundColor: colors.bgCard,
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
                backgroundColor: active ? fixed.purple : 'transparent',
              }}
            >
              <Text style={[active ? FONTS.bold : FONTS.regular, { color: active ? '#FFFFFF' : colors.textSecondary, fontSize: 12 }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === 'breathing' ? (
        <BreathingExercise onComplete={completeSession} />
      ) : (
        <DistractionGame onComplete={completeSession} />
      )}

      {sessionDone ? (
        <Card
          style={{
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
            borderWidth: 1,
            gap: 8,
          }}
        >
          <Text
            style={[
              FONTS.bold,
              { color: colors.accent, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' },
            ]}
          >
            {i18n.t('sosScreen.doneLabel')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('sosScreen.doneTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('sosScreen.doneBody')}
          </Text>
          <Button label={i18n.t('sosScreen.finishExercise')} onPress={() => router.back()} />
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
