import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppLanguage, AppTheme, UserProfile } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

type OnboardingDraft = Partial<UserProfile>;

interface UserState {
  profile: UserProfile | null;
  onboardingDraft: OnboardingDraft | null;
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  milestoneNotificationsEnabled: boolean;
  motivationNotificationsEnabled: boolean;
  language: AppLanguage;
  theme: AppTheme;
  setProfile: (profile: UserProfile) => void;
  setOnboardingDraft: (draft: OnboardingDraft) => void;
  updateOnboardingDraft: (draft: OnboardingDraft) => void;
  clearOnboardingDraft: () => void;
  completeOnboarding: () => void;
  setReminder: (enabled: boolean, hour: number, minute: number) => void;
  setNotificationPreferences: (values: {
    milestoneNotificationsEnabled?: boolean;
    motivationNotificationsEnabled?: boolean;
  }) => void;
  setLanguage: (language: AppLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingDraft: null,
      hasCompletedOnboarding: false,
      hasHydrated: false,
      reminderEnabled: true,
      reminderHour: 19,
      reminderMinute: 0,
      milestoneNotificationsEnabled: true,
      motivationNotificationsEnabled: true,
      language: 'fr',
      theme: 'system',
      setProfile: (profile) => set({ profile }),
      setOnboardingDraft: (draft) => set({ onboardingDraft: draft }),
      updateOnboardingDraft: (draft) =>
        set((state) => ({ onboardingDraft: { ...state.onboardingDraft, ...draft } })),
      clearOnboardingDraft: () => set({ onboardingDraft: null }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setReminder: (enabled, hour, minute) =>
        set({ reminderEnabled: enabled, reminderHour: hour, reminderMinute: minute }),
      setNotificationPreferences: (values) => set(values),
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
