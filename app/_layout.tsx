import '../global.css';

import {
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme as useNativeColorScheme, View } from 'react-native';

import { DARK, LIGHT } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { configureI18n, i18n } from '@/services/i18n';
import { configureNotificationChannel, requestNotificationPermission, syncMilestoneNotifications } from '@/services/notifications';
import { initializeRevenueCat } from '@/services/revenuecat';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const profile = useUserStore((state) => state.profile);
  const language = useUserStore((state) => state.language);
  const theme = useUserStore((state) => state.theme);
  const { setColorScheme } = useColorScheme();
  const nativeScheme = useNativeColorScheme();
  const { colors, isDark } = useTheme();
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    configureI18n(language);
  }, [language]);

  useEffect(() => {
    const resolved =
      theme === 'system'
        ? nativeScheme === 'dark'
          ? 'dark'
          : 'light'
        : theme;
    setColorScheme(resolved);
  }, [nativeScheme, setColorScheme, theme]);

  useEffect(() => {
    initializeRevenueCat().catch(() => undefined);
    configureNotificationChannel().catch(() => undefined);
    requestNotificationPermission()
      .then((granted) => setNotificationPermissionGranted(granted))
      .catch(() => setNotificationPermissionGranted(false));
  }, [setNotificationPermissionGranted]);

  useEffect(() => {
    syncMilestoneNotifications(profile).catch(() => undefined);
  }, [profile]);

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const inOnboarding = pathname.startsWith('/welcome') || pathname.startsWith('/setup') || pathname.startsWith('/ready');
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/welcome');
      return;
    }

    if (hasCompletedOnboarding && inOnboarding) {
      router.replace('/');
    }
  }, [hasCompletedOnboarding, hasHydrated, pathname, router]);

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgPrimary }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? DARK.bgPrimary : LIGHT.bgPrimary,
          },
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="sos"
          options={{
            presentation: 'fullScreenModal',
            contentStyle: {
              backgroundColor: isDark ? DARK.bgSos : LIGHT.bgSos,
            },
          }}
        />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="milestone/[id]"
        options={{ headerShown: true, title: i18n.t('milestone.title') }}
      />
      </Stack>
    </>
  );
}
