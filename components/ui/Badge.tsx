import { Text, View } from 'react-native';

import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  tone?: 'accent' | 'neutral' | 'warning';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const { colors, fixed } = useTheme();
  const styles = {
    accent: {
      backgroundColor: fixed.purple,
      color: '#FFFFFF',
    },
    neutral: {
      backgroundColor: colors.bgCard,
      color: colors.textSecondary,
    },
    warning: {
      backgroundColor: colors.accentBg,
      color: colors.accent,
    },
  }[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: RADII.full,
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: styles.backgroundColor,
      }}
    >
      <Text
        style={[
          FONTS.bold,
          {
            color: styles.color,
            fontSize: 8,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
