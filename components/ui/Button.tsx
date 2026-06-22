import { Pressable, type PressableProps, type StyleProp, Text, type ViewStyle } from 'react-native';

import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'sos' | 'ghost';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, style, variant = 'primary', ...props }: ButtonProps) {
  const { colors, fixed } = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? fixed.purple
      : variant === 'sos'
        ? colors.accentBg
        : variant === 'secondary'
          ? colors.bgCard
          : 'transparent';

  const borderColor =
    variant === 'primary'
      ? 'transparent'
      : variant === 'sos'
        ? colors.accentBorder
        : variant === 'secondary'
          ? colors.accentBorder
          : 'transparent';

  const textColor =
    variant === 'primary'
      ? '#FFFFFF'
      : variant === 'sos'
        ? colors.accent
        : variant === 'secondary'
          ? colors.textPrimary
          : colors.accent;

  return (
    <Pressable
      className={props.className}
      style={[
        {
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: RADII.md,
          borderWidth: variant === 'primary' ? 0 : 1,
          backgroundColor,
          borderColor,
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          FONTS.black,
          {
            color: textColor,
            fontSize: 13,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
