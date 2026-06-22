import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  value,
}: ProgressRingProps) {
  const { colors, fixed } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.dividerStrong}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fixed.purple}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        {label ? (
          <Text style={[FONTS.bold, { fontSize: 8, color: colors.textMuted, letterSpacing: 1.5 }]}>
            {label}
          </Text>
        ) : null}
        <Text style={[FONTS.black, { fontSize: 20, color: colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}
