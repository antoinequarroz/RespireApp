import { ScrollView, Text, View } from 'react-native';

import { BreathingExercise } from '@/components/domain/BreathingExercise';
import { DistractionGame } from '@/components/domain/DistractionGame';
import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { FONTS, SPACING } from '@/constants/theme';
import { useSos } from '@/hooks/useSos';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

export default function SosScreen() {
  const { colors } = useTheme();
  const { mode, setMode, sessionDone, completeSession } = useSos();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgSos }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.xl }}>
        <AppLogo size="header" />
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.accent,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
          ]}
        >
          SOS
        </Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('sosScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('sosScreen.subtitle')}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.md }}>
        <Button
          label={i18n.t('sosScreen.breathing')}
          variant={mode === 'breathing' ? 'primary' : 'secondary'}
          style={{ flex: 1 }}
          onPress={() => setMode('breathing')}
        />
        <Button
          label={i18n.t('sosScreen.game')}
          variant={mode === 'game' ? 'primary' : 'secondary'}
          style={{ flex: 1 }}
          onPress={() => setMode('game')}
        />
      </View>

      {mode === 'breathing' ? (
        <BreathingExercise onComplete={completeSession} />
      ) : (
        <DistractionGame onComplete={completeSession} />
      )}

      {sessionDone ? (
        <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13, textAlign: 'center' }]}>
          {i18n.t('sosScreen.done')}
        </Text>
      ) : null}
    </ScrollView>
  );
}
