import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

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
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View
        style={{
          paddingTop: SPACING.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
        <Button
          label="×"
          variant="ghost"
          style={{ minHeight: 36, width: 36, paddingHorizontal: 0, paddingVertical: 0 }}
          onPress={() => router.back()}
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
          gap: SPACING.sm,
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
            <View key={item.key} style={{ flex: 1 }}>
              <Button
                label={item.label}
                variant={active ? 'primary' : 'ghost'}
                style={
                  active
                    ? { flex: 1 }
                    : { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'transparent' }
                }
                onPress={() => setMode(item.key as 'breathing' | 'game')}
              />
            </View>
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
      ) : null}

      {!sessionDone ? (
        <Text
          style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}
          onPress={() => router.back()}
        >
          {i18n.t('sosScreen.finishExercise')}
        </Text>
      ) : null}
    </ScrollView>
  );
}
