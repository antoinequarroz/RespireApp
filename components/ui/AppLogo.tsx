import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface AppLogoProps {
  size?: 'header' | 'hero';
  forceScheme?: 'dark' | 'light';
}

export function AppLogo({ size = 'header', forceScheme }: AppLogoProps) {
  const { colors, isDark } = useTheme(forceScheme);
  const fontSize = size === 'hero' ? 28 : 15;
  const lineHeight = size === 'hero' ? 32 : 18;

  const text = (
    <Text
      style={[
        FONTS.black,
        {
          fontSize,
          lineHeight,
          color: colors.accent,
        },
      ]}
      >
      respire
    </Text>
  );

  return (
    <View>
      <MaskedView maskElement={text}>
        <LinearGradient
          colors={isDark ? ['#A78BFA', '#10B981'] : ['#7C3AED', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              FONTS.black,
              {
                opacity: 0,
                fontSize,
                lineHeight,
              },
            ]}
          >
            respire
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}
