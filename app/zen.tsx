import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BreathingExercise, type BreathingTechniqueId } from '@/components/domain/BreathingExercise';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useProgressStore } from '@/store/progressStore';

const TECHNIQUES: { id: BreathingTechniqueId; duration: string; labelKey: string }[] = [
  { id: 'coherence', duration: '5 min', labelKey: 'zen.techniques.coherence' },
  { id: '478', duration: '1 min 30', labelKey: 'zen.techniques.fourSevenEight' },
  { id: 'box', duration: '4 min', labelKey: 'zen.techniques.box' },
];

export default function ZenScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const incrementZenSessionsCompleted = useProgressStore((state) => state.incrementZenSessionsCompleted);
  const zenSessionsCompleted = useProgressStore((state) => state.zenSessionsCompleted);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechniqueId>('coherence');
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: fixed.sosBg }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: SPACING.xxl, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 14 }]}>{i18n.t('zen.title')}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, marginTop: 4 }]}>
            {i18n.t('zen.subtitle')}
          </Text>
        </View>
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

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {TECHNIQUES.map((technique) => {
          const active = selectedTechnique === technique.id;

          return (
            <Pressable
              key={technique.id}
              onPress={() => {
                setSelectedTechnique(technique.id);
                setSessionDone(false);
                setSessionVersion((value) => value + 1);
              }}
              style={{
                flex: 1,
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: active ? colors.accentBorder : colors.bgCardBorder,
                backgroundColor: active ? colors.accentBg : colors.bgCard,
                paddingHorizontal: 10,
                paddingVertical: 10,
                gap: 3,
              }}
            >
              <Text style={[FONTS.bold, { color: active ? colors.accent : colors.textPrimary, fontSize: 11 }]}>
                {i18n.t(technique.labelKey)}
              </Text>
              <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10 }]}>{technique.duration}</Text>
            </Pressable>
          );
        })}
      </View>

      <BreathingExercise
        key={`${selectedTechnique}-${sessionVersion}`}
        techniqueId={selectedTechnique}
        tone="zen"
        onComplete={() => {
          if (!sessionDone) {
            incrementZenSessionsCompleted();
            setSessionDone(true);
          }
        }}
      />

      <Card
        style={{
          backgroundColor: colors.bgCard,
          borderColor: colors.bgCardBorder,
          gap: 8,
        }}
      >
        <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
          {i18n.t('zen.sessionStats')}
        </Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {zenSessionsCompleted} {i18n.t('zen.completedSessions')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
          {sessionDone ? i18n.t('zen.doneBody') : i18n.t('zen.focusBody')}
        </Text>
      </Card>

      {sessionDone ? (
        <View style={{ gap: 10 }}>
          <Button
            label={i18n.t('zen.replay')}
            onPress={() => {
              setSessionDone(false);
              setSessionVersion((value) => value + 1);
            }}
          />
          <Button label={i18n.t('common.close')} variant="secondary" onPress={() => router.back()} />
        </View>
      ) : null}
    </ScrollView>
  );
}
