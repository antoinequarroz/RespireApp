import '../global.css';

import {
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { type Href, Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { AppState, useColorScheme as useNativeColorScheme, View } from 'react-native';

import { DARK, LIGHT } from '@/constants/theme';
import { computeUserLevel } from '@/hooks/useUserLevel';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useMilestones } from '@/hooks/useMilestones';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { useWeeklyChallenge } from '@/hooks/useWeeklyChallenge';
import { configureI18n } from '@/services/i18n';
import { useAuthStore } from '@/store/authStore';
import { canShowDailyMotivation, markMotivationShownToday } from '@/services/motivation';
import {
  configureNotificationChannel,
  getNotificationPermissionStatus,
  syncDailyReminder,
  syncMilestoneNotifications,
} from '@/services/notifications';
import {
  getCustomerInfo,
  hasRevenueCatConfig,
  initializeRevenueCat,
  isPremiumCustomer,
} from '@/services/revenuecat';
import { usePremiumStore } from '@/store/premiumStore';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const profile = useUserStore((state) => state.profile);
  const language = useUserStore((state) => state.language);
  const theme = useUserStore((state) => state.theme);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const reminderHour = useUserStore((state) => state.reminderHour);
  const reminderMinute = useUserStore((state) => state.reminderMinute);
  const milestoneNotificationsEnabled = useUserStore((state) => state.milestoneNotificationsEnabled);
  const motivationNotificationsEnabled = useUserStore((state) => state.motivationNotificationsEnabled);
  const rewardGoals = useUserStore((state) => state.rewardGoals);
  const { setColorScheme } = useColorScheme();
  const nativeScheme = useNativeColorScheme();
  const { colors, isDark } = useTheme();
  const { moneySaved } = useSavings();
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );
  const registerAppOpen = useProgressStore((state) => state.registerAppOpen);
  const markMilestoneCelebrated = useProgressStore((state) => state.markMilestoneCelebrated);
  const celebratedRewardGoalIds = useProgressStore((state) => state.celebratedRewardGoalIds);
  const markRewardGoalCelebrated = useProgressStore((state) => state.markRewardGoalCelebrated);
  const setUserLevel = useProgressStore((state) => state.setUserLevel);
  const setPremiumStatus = usePremiumStore((state) => state.setPremiumStatus);
  const { nextToCelebrate } = useMilestones();

  // Weekly challenge generation (side-effect hook)
  useWeeklyChallenge();

  // Cloud sync (no-op if not logged in)
  useCloudSync();

  // Initialize Supabase auth session
  const initializeAuth = useAuthStore((s) => s.initialize);
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    initializeAuth().then((unsub) => { unsubscribe = unsub; }).catch(() => undefined);
    return () => unsubscribe?.();
  }, [initializeAuth]);

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
      theme === 'system' ? (nativeScheme === 'dark' ? 'dark' : 'light') : theme;
    setColorScheme(resolved);
  }, [nativeScheme, setColorScheme, theme]);

  useEffect(() => {
    initializeRevenueCat()
      .then(async () => {
        if (!hasRevenueCatConfig()) return;
        const customerInfo = await getCustomerInfo();
        setPremiumStatus(isPremiumCustomer(customerInfo));
      })
      .catch(() => undefined);
    configureNotificationChannel().catch(() => undefined);
    getNotificationPermissionStatus()
      .then((granted) => setNotificationPermissionGranted(granted))
      .catch(() => setNotificationPermissionGranted(false));
  }, [setNotificationPermissionGranted, setPremiumStatus]);

  useEffect(() => {
    syncMilestoneNotifications(profile, milestoneNotificationsEnabled).catch(() => undefined);
  }, [milestoneNotificationsEnabled, profile]);

  useEffect(() => {
    syncDailyReminder(
      reminderEnabled,
      reminderHour,
      reminderMinute,
      motivationNotificationsEnabled,
    ).catch(() => undefined);
  }, [motivationNotificationsEnabled, reminderEnabled, reminderHour, reminderMinute]);

  useEffect(() => {
    if (!hasHydrated) return;
    registerAppOpen();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') registerAppOpen();
    });
    return () => subscription.remove();
  }, [hasHydrated, registerAppOpen]);

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, hasHydrated]);

  // Sync userLevel into progressStore whenever profile changes
  useEffect(() => {
    if (!profile) return;
    const smokeFreeDays = Math.floor(
      (Date.now() - new Date(profile.lastCigaretteAt).getTime()) / (24 * 60 * 60 * 1000),
    );
    const { level } = computeUserLevel(smokeFreeDays);
    setUserLevel(level);
  }, [profile, setUserLevel]);

  // Milestone celebration
  useEffect(() => {
    const topSegment = segments[0];
    const inOnboardingGroup = topSegment === '(onboarding)';
    const inLaunchFlow = pathname === '/' || pathname === '/sos' || inOnboardingGroup;
    const inMilestone = pathname.startsWith('/milestone/');

    if (!hasHydrated || !hasCompletedOnboarding || inLaunchFlow || inMilestone || !nextToCelebrate) {
      return;
    }
    if (AppState.currentState !== 'active') return;

    markMilestoneCelebrated(nextToCelebrate.id);
    router.push(`/milestone/${nextToCelebrate.id}`);
  }, [
    hasCompletedOnboarding,
    hasHydrated,
    markMilestoneCelebrated,
    nextToCelebrate,
    pathname,
    router,
    segments,
  ]);

  // Reward goal celebration
  useEffect(() => {
    const topSegment = segments[0];
    const inOnboardingGroup = topSegment === '(onboarding)';
    const inLaunchFlow =
      pathname === '/' ||
      pathname === '/sos' ||
      pathname === '/reward' ||
      pathname === '/reward-achieved' ||
      inOnboardingGroup;

    if (!hasHydrated || !hasCompletedOnboarding || inLaunchFlow) return;
    if (AppState.currentState !== 'active') return;

    const completedGoal = rewardGoals.find(
      (goal) =>
        goal.amount > 0 &&
        moneySaved >= goal.amount &&
        !celebratedRewardGoalIds.includes(goal.id),
    );
    if (!completedGoal) return;

    markRewardGoalCelebrated(completedGoal.id);
    router.push('/reward-achieved' as Href);
  }, [
    celebratedRewardGoalIds,
    hasCompletedOnboarding,
    hasHydrated,
    markRewardGoalCelebrated,
    moneySaved,
    pathname,
    rewardGoals,
    router,
    segments,
  ]);

  // Daily motivation
  useEffect(() => {
    const topSegment = segments[0];
    const inTabsGroup = topSegment === '(tabs)';
    const blockedRoute =
      pathname === '/sos' ||
      pathname === '/motivation' ||
      pathname === '/reward' ||
      pathname === '/reward-achieved' ||
      pathname.startsWith('/milestone/');

    if (
      !hasHydrated ||
      !hasCompletedOnboarding ||
      !inTabsGroup ||
      blockedRoute ||
      useProgressStore.getState().appOpenStreak < 3 ||
      AppState.currentState !== 'active'
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      canShowDailyMotivation()
        .then((shouldShow) => {
          if (!shouldShow) return;
          return markMotivationShownToday().then(() =>
            router.push(
              `/motivation?trigger=daily&streak=${useProgressStore.getState().appOpenStreak}` as Href,
            ),
          );
        })
        .catch(() => undefined);
    }, 700);

    return () => clearTimeout(timeout);
  }, [hasCompletedOnboarding, hasHydrated, pathname, router, segments]);

  // Routing guard
  useEffect(() => {
    if (!hasHydrated) return;
    const topSegment = segments[0];
    const inOnboardingGroup = topSegment === '(onboarding)';
    const inTabsGroup = topSegment === '(tabs)';
    const isSplashRoute = topSegment == null;
    const inLaunchFlow = isSplashRoute || pathname === '/sos' || inOnboardingGroup;

    if (!hasCompletedOnboarding && !inLaunchFlow) { router.replace('/'); return; }
    if (hasCompletedOnboarding && isSplashRoute) { router.replace('/(tabs)'); return; }
    if (hasCompletedOnboarding && inOnboardingGroup) { router.replace('/(tabs)'); return; }
    if (!hasCompletedOnboarding && inTabsGroup) router.replace('/');
  }, [hasCompletedOnboarding, hasHydrated, pathname, router, segments]);

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgPrimary }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.accentBg,
          }}
        >
          <View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: colors.accent }} />
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? DARK.bgPrimary : LIGHT.bgPrimary },
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="sos"
          options={{
            presentation: 'fullScreenModal',
            contentStyle: { backgroundColor: isDark ? DARK.bgSos : LIGHT.bgSos },
          }}
        />
        <Stack.Screen
          name="zen"
          options={{
            presentation: 'fullScreenModal',
            contentStyle: { backgroundColor: isDark ? DARK.bgSos : LIGHT.bgSos },
          }}
        />
        <Stack.Screen name="relapse" options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="reward" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="reward-achieved" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen
          name="motivation"
          options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: DARK.bgDeep } }}
        />
        <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen
          name="milestone/[id]"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
        <Stack.Screen
          name="health-timeline"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="(auth)/login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(auth)/register" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
