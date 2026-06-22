import { View, type ViewProps } from 'react-native';

import { RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export function Card({
  className = '',
  style,
  ...props
}: ViewProps & { className?: string }) {
  const { colors } = useTheme();

  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.bgCardBorder,
          borderWidth: 0.5,
          borderRadius: RADII.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
        },
        style,
      ]}
      {...props}
    />
  );
}
