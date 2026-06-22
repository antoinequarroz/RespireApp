import { Text, View } from 'react-native';

import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface SavingsEquivalentProps {
  emoji: string;
  label: string;
}

export function SavingsEquivalent({ emoji, label }: SavingsEquivalentProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: RADII.md,
        backgroundColor: colors.accentBg,
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={[FONTS.regular, { flex: 1, fontSize: 13, color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}
