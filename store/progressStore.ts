import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { JournalEntry } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

type SosMode = 'breathing' | 'game';
export type UserLevel = 1 | 2 | 3 | 4 | 5;

const DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * DAY_MS;

function startOfDayTimestamp(value: string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export interface ActiveWeeklyChallenge {
  id: string;
  label: string;
  target: number;
  current: number;
  weekStart: string;
  completed: boolean;
  celebrationSeen: boolean;
}

interface UsedPhrase {
  id: string;
  usedAt: string;
}

interface ProgressState {
  journalEntries: JournalEntry[];
  celebratedMilestones: string[];
  celebratedRewardGoalIds: string[];
  celebratedBadgeIds: string[];
  cravingsHandled: number;
  appOpenStreak: number;
  lastAppOpenDate: string | null;
  zenSessionsCompleted: number;
  lastSosMode: SosMode;
  notificationPermissionGranted: boolean;
  weeklyChallenge: ActiveWeeklyChallenge | null;
  usedChallengeIds: string[];
  weeklyBadgeCount: number;
  userLevel: UserLevel;
  usedPhraseIds: UsedPhrase[];
  lastMotivationSentAt: string | null;
  addJournalEntry: (entry: JournalEntry) => void;
  markMilestoneCelebrated: (milestoneId: string) => void;
  markRewardGoalCelebrated: (goalId: string) => void;
  markBadgeCelebrated: (badgeId: string) => void;
  incrementCravingsHandled: () => void;
  incrementZenSessionsCompleted: () => void;
  registerAppOpen: (now?: string) => void;
  setLastSosMode: (mode: SosMode) => void;
  setNotificationPermissionGranted: (value: boolean) => void;
  setWeeklyChallenge: (challenge: ActiveWeeklyChallenge | null) => void;
  updateWeeklyChallengeProgress: (current: number) => void;
  completeWeeklyChallenge: () => void;
  markChallengeCelebrationSeen: () => void;
  markMotivationPhraseUsed: (phraseId: string) => void;
  getRecentUsedPhraseIds: () => string[];
  setUserLevel: (level: UserLevel) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      journalEntries: [],
      celebratedMilestones: [],
      celebratedRewardGoalIds: [],
      celebratedBadgeIds: [],
      cravingsHandled: 0,
      appOpenStreak: 0,
      lastAppOpenDate: null,
      zenSessionsCompleted: 0,
      lastSosMode: 'breathing',
      notificationPermissionGranted: false,
      weeklyChallenge: null,
      usedChallengeIds: [],
      weeklyBadgeCount: 0,
      userLevel: 1,
      usedPhraseIds: [],
      lastMotivationSentAt: null,
      addJournalEntry: (entry) => {
        const others = get().journalEntries.filter((item) => item.date !== entry.date);
        set({ journalEntries: [...others, entry] });
      },
      markMilestoneCelebrated: (milestoneId) => {
        if (get().celebratedMilestones.includes(milestoneId)) return;
        set({ celebratedMilestones: [...get().celebratedMilestones, milestoneId] });
      },
      markRewardGoalCelebrated: (goalId) => {
        if (get().celebratedRewardGoalIds.includes(goalId)) return;
        set({ celebratedRewardGoalIds: [...get().celebratedRewardGoalIds, goalId] });
      },
      markBadgeCelebrated: (badgeId) => {
        if (get().celebratedBadgeIds.includes(badgeId)) return;
        set({ celebratedBadgeIds: [...get().celebratedBadgeIds, badgeId] });
      },
      incrementCravingsHandled: () => set({ cravingsHandled: get().cravingsHandled + 1 }),
      incrementZenSessionsCompleted: () =>
        set({ zenSessionsCompleted: get().zenSessionsCompleted + 1 }),
      registerAppOpen: (now = new Date().toISOString()) => {
        const today = now.split('T')[0];
        const { lastAppOpenDate, appOpenStreak } = get();

        if (!lastAppOpenDate) {
          set({ lastAppOpenDate: today, appOpenStreak: 1 });
          return;
        }

        if (lastAppOpenDate === today) {
          return;
        }

        const lastTs = startOfDayTimestamp(lastAppOpenDate + 'T00:00:00.000Z');
        const todayTs = startOfDayTimestamp(now);
        const diffDays = Math.floor((todayTs - lastTs) / DAY_MS);

        if (diffDays === 1) {
          set({ lastAppOpenDate: today, appOpenStreak: appOpenStreak + 1 });
        } else {
          set({ lastAppOpenDate: today, appOpenStreak: 1 });
        }
      },
      setLastSosMode: (mode) => set({ lastSosMode: mode }),
      setNotificationPermissionGranted: (value) => set({ notificationPermissionGranted: value }),
      setWeeklyChallenge: (challenge) => {
        const { weeklyChallenge } = get();
        if (challenge && weeklyChallenge?.id !== challenge.id) {
          set({
            weeklyChallenge: challenge,
            usedChallengeIds: [...get().usedChallengeIds, challenge.id],
          });
        } else {
          set({ weeklyChallenge: challenge });
        }
      },
      updateWeeklyChallengeProgress: (current) => {
        const { weeklyChallenge } = get();
        if (!weeklyChallenge) return;
        const completed = current >= weeklyChallenge.target;
        set({ weeklyChallenge: { ...weeklyChallenge, current, completed } });
      },
      completeWeeklyChallenge: () => {
        const { weeklyChallenge } = get();
        if (!weeklyChallenge || weeklyChallenge.completed) return;
        set({
          weeklyChallenge: { ...weeklyChallenge, completed: true },
          weeklyBadgeCount: get().weeklyBadgeCount + 1,
        });
      },
      markChallengeCelebrationSeen: () => {
        const { weeklyChallenge } = get();
        if (!weeklyChallenge) return;
        set({ weeklyChallenge: { ...weeklyChallenge, celebrationSeen: true } });
      },
      markMotivationPhraseUsed: (phraseId) => {
        const now = new Date().toISOString();
        const cutoff = Date.now() - SEVEN_DAYS_MS;
        const pruned = get().usedPhraseIds.filter(
          (entry) => new Date(entry.usedAt).getTime() > cutoff,
        );
        set({ usedPhraseIds: [...pruned, { id: phraseId, usedAt: now }], lastMotivationSentAt: now });
      },
      getRecentUsedPhraseIds: () => {
        const cutoff = Date.now() - SEVEN_DAYS_MS;
        return get()
          .usedPhraseIds.filter((entry) => new Date(entry.usedAt).getTime() > cutoff)
          .map((entry) => entry.id);
      },
      setUserLevel: (level) => set({ userLevel: level }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: createJSONStorage(() => AsyncStorage),
      version: 5,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const legacyKey = state.celebratedRewardGoalKey as string | null | undefined;
          state.celebratedRewardGoalIds = legacyKey ? [legacyKey] : [];
          delete state.celebratedRewardGoalKey;
        }
        if (version < 3) {
          delete state.lastMotivationPhraseIndex;
          state.usedPhraseIds = [];
          if (!state.lastMotivationSentAt) state.lastMotivationSentAt = null;
        }
        if (version < 5) {
          state.celebratedBadgeIds = [];
        }
        if (version < 4) {
          // lastAppOpenAt (ISO datetime) → lastAppOpenDate (YYYY-MM-DD)
          if (state.lastAppOpenAt) {
            state.lastAppOpenDate = (state.lastAppOpenAt as string).split('T')[0];
          } else {
            state.lastAppOpenDate = null;
          }
          delete state.lastAppOpenAt;
          if (!state.weeklyChallenge) {
            state.weeklyChallenge = null;
          } else {
            // Add new fields to existing challenge
            const wc = state.weeklyChallenge as Record<string, unknown>;
            if (wc.completed === undefined) wc.completed = false;
            if (wc.celebrationSeen === undefined) wc.celebrationSeen = false;
          }
          state.usedChallengeIds = [];
          state.weeklyBadgeCount = 0;
          state.userLevel = 1;
        }
        return state as unknown as ProgressState;
      },
    },
  ),
);
