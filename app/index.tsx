import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SplashRoute() {
  const router = useRouter();
  const { colors } = useTheme();
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(hasCompletedOnboarding ? '/(tabs)' : '/welcome');
    }, 2200);

    return () => clearTimeout(timeout);
  }, [hasCompletedOnboarding, router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgPrimary,
        paddingHorizontal: SPACING.xl,
      }}
    >
      <AppLogo size="hero" />
      <Text
        style={[
          FONTS.regular,
          {
            marginTop: SPACING.md,
            color: colors.textMuted,
            fontSize: 13,
            textAlign: 'center',
          },
        ]}
      >
        {i18n.t('app.tagline')}
      </Text>
    </View>
  );
}
