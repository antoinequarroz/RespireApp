import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface MilestonesSectionProps {
  nextLabel: string;
  progress: number;
}

export function MilestonesSection({ nextLabel, progress }: MilestonesSectionProps) {
  const { colors, fixed } = useTheme();

  return (
    <Card>
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
        {i18n.t('home.nextMilestone')}
      </Text>
      <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13, marginTop: 6 }]}>
        {nextLabel}
      </Text>
      <View
        style={{
          height: 3,
          backgroundColor: colors.dividerStrong,
          borderRadius: 999,
          marginTop: 12,
        }}
      >
        <View
          style={{
            height: 3,
            width: `${Math.max(progress * 100, 6)}%`,
            backgroundColor: fixed.purple,
            borderRadius: 999,
          }}
        />
      </View>
    </Card>
  );
}
