import '../global.css';

import { Stack, usePathname, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme as useNativeColorScheme,View } from 'react-native';

import { configureI18n, i18n } from '@/services/i18n';
import { configureNotificationChannel, requestNotificationPermission, syncMilestoneNotifications } from '@/services/notifications';
import { initializeRevenueCat } from '@/services/revenuecat';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

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
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );

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

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-night">
        <ActivityIndicator size="large" color="#1B6CA8" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' },
      }}
    >
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sos" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="milestone/[id]"
        options={{ headerShown: true, title: i18n.t('milestone.title') }}
      />
    </Stack>
  );
}
