import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface HealthSectionProps {
  progress: number;
  nextLabel: string;
  completed: number;
}

export function HealthSection({ progress, nextLabel, completed }: HealthSectionProps) {
  const { colors } = useTheme();

  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ maxWidth: '56%', gap: 6 }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 9,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('home.healthTeaser')}
        </Text>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>{nextLabel}</Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {completed}
        </Text>
      </View>
      <ProgressRing progress={progress} label="" value={`${completed}`} size={94} strokeWidth={8} />
    </Card>
  );
}
