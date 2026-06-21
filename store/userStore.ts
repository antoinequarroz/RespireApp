import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppLanguage, AppTheme, UserProfile } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

interface UserState {
  profile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  language: AppLanguage;
  theme: AppTheme;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  setReminder: (enabled: boolean, hour: number, minute: number) => void;
  setLanguage: (language: AppLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      hasCompletedOnboarding: false,
      hasHydrated: false,
      reminderEnabled: true,
      reminderHour: 19,
      reminderMinute: 0,
      language: 'fr',
      theme: 'system',
      setProfile: (profile) => set({ profile }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setReminder: (enabled, hour, minute) =>
        set({ reminderEnabled: enabled, reminderHour: hour, reminderMinute: minute }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.user,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
