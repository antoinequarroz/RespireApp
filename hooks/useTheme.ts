import { useColorScheme } from 'react-native';

import { DARK, FIXED, LIGHT } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  const colors = isDark ? DARK : LIGHT;

  return { colors, fixed: FIXED, isDark };
}
