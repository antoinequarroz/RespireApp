import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppCurrency, AppLanguage, AppTheme, UserProfile } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

type OnboardingDraft = Partial<UserProfile>;

export interface RewardGoal {
  id: string;
  label: string;
  amount: number;
  createdAt: string;
}

export interface NotifCategories {
  contextual: boolean;
  general: boolean;
  statBased: boolean;
  challenges: boolean;
}

interface UserState {
  profile: UserProfile | null;
  onboardingDraft: OnboardingDraft | null;
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  rewardGoals: RewardGoal[];
  savedPhraseIds: string[];
  notifCategories: NotifCategories;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  milestoneNotificationsEnabled: boolean;
  motivationNotificationsEnabled: boolean;
  currency: AppCurrency;
  language: AppLanguage;
  theme: AppTheme;
  setProfile: (profile: UserProfile) => void;
  setOnboardingDraft: (draft: OnboardingDraft) => void;
  updateOnboardingDraft: (draft: OnboardingDraft) => void;
  clearOnboardingDraft: () => void;
  completeOnboarding: () => void;
  addRewardGoal: (label: string, amount: number) => void;
  removeRewardGoal: (id: string) => void;
  addSavedPhraseId: (id: string) => void;
  removeSavedPhraseId: (id: string) => void;
  setNotifCategories: (cats: Partial<NotifCategories>) => void;
  setReminder: (enabled: boolean, hour: number, minute: number) => void;
  setNotificationPreferences: (values: {
    milestoneNotificationsEnabled?: boolean;
    motivationNotificationsEnabled?: boolean;
  }) => void;
  setLanguage: (language: AppLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  setHasHydrated: (value: boolean) => void;
}

const DEFAULT_NOTIF_CATEGORIES: NotifCategories = {
  contextual: true,
  general: true,
  statBased: true,
  challenges: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      onboardingDraft: null,
      hasCompletedOnboarding: false,
      hasHydrated: false,
      rewardGoals: [],
      savedPhraseIds: [],
      notifCategories: DEFAULT_NOTIF_CATEGORIES,
      reminderEnabled: true,
      reminderHour: 19,
      reminderMinute: 0,
      milestoneNotificationsEnabled: true,
      motivationNotificationsEnabled: true,
      currency: 'EUR',
      language: 'fr',
      theme: 'system',
      setProfile: (profile) => set({ profile }),
      setOnboardingDraft: (draft) => set({ onboardingDraft: draft }),
      updateOnboardingDraft: (draft) =>
        set((state) => ({ onboardingDraft: { ...state.onboardingDraft, ...draft } })),
      clearOnboardingDraft: () => set({ onboardingDraft: null }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      addRewardGoal: (label, amount) => {
        const goal: RewardGoal = {
          id: `goal-${Date.now()}`,
          label,
          amount,
          createdAt: new Date().toISOString(),
        };
        set({ rewardGoals: [...get().rewardGoals, goal] });
      },
      removeRewardGoal: (id) =>
        set({ rewardGoals: get().rewardGoals.filter((g) => g.id !== id) }),
      addSavedPhraseId: (id) => {
        if (get().savedPhraseIds.includes(id)) return;
        set({ savedPhraseIds: [...get().savedPhraseIds, id] });
      },
      removeSavedPhraseId: (id) =>
        set({ savedPhraseIds: get().savedPhraseIds.filter((p) => p !== id) }),
      setNotifCategories: (cats) =>
        set({ notifCategories: { ...get().notifCategories, ...cats } }),
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
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const label = state.rewardGoalLabel as string | undefined;
          const amount = state.rewardGoalAmount as number | undefined;
          if (label && amount && amount > 0) {
            state.rewardGoals = [{ id: 'goal-migrated', label, amount, createdAt: new Date().toISOString() }];
          } else {
            state.rewardGoals = [];
          }
          delete state.rewardGoalLabel;
          delete state.rewardGoalAmount;
        }
        if (version < 3) {
          state.savedPhraseIds = [];
          state.notifCategories = DEFAULT_NOTIF_CATEGORIES;
        }
        return state as unknown as UserState;
      },
    },
  ),
);
