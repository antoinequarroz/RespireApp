import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { JournalEntry } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

type SosMode = 'breathing' | 'game';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDayTimestamp(value: string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

interface ProgressState {
  journalEntries: JournalEntry[];
  celebratedMilestones: string[];
  celebratedRewardGoalKey: string | null;
  cravingsHandled: number;
  appOpenStreak: number;
  lastAppOpenAt: string | null;
  zenSessionsCompleted: number;
  lastSosMode: SosMode;
  notificationPermissionGranted: boolean;
  addJournalEntry: (entry: JournalEntry) => void;
  markMilestoneCelebrated: (milestoneId: string) => void;
  markRewardGoalCelebrated: (key: string) => void;
  incrementCravingsHandled: () => void;
  incrementZenSessionsCompleted: () => void;
  registerAppOpen: (now?: string) => void;
  setLastSosMode: (mode: SosMode) => void;
  setNotificationPermissionGranted: (value: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      journalEntries: [],
      celebratedMilestones: [],
      celebratedRewardGoalKey: null,
      cravingsHandled: 0,
      appOpenStreak: 0,
      lastAppOpenAt: null,
      zenSessionsCompleted: 0,
      lastSosMode: 'breathing',
      notificationPermissionGranted: false,
      addJournalEntry: (entry) => {
        const others = get().journalEntries.filter((item) => item.date !== entry.date);
        set({ journalEntries: [...others, entry] });
      },
      markMilestoneCelebrated: (milestoneId) => {
        if (get().celebratedMilestones.includes(milestoneId)) {
          return;
        }

        set({ celebratedMilestones: [...get().celebratedMilestones, milestoneId] });
      },
      markRewardGoalCelebrated: (key) => {
        if (get().celebratedRewardGoalKey === key) {
          return;
        }

        set({ celebratedRewardGoalKey: key });
      },
      incrementCravingsHandled: () => set({ cravingsHandled: get().cravingsHandled + 1 }),
      incrementZenSessionsCompleted: () =>
        set({ zenSessionsCompleted: get().zenSessionsCompleted + 1 }),
      registerAppOpen: (now = new Date().toISOString()) => {
        const { lastAppOpenAt, appOpenStreak } = get();

        if (!lastAppOpenAt) {
          set({ lastAppOpenAt: now, appOpenStreak: 1 });
          return;
        }

        const diffDays = Math.floor(
          (startOfDayTimestamp(now) - startOfDayTimestamp(lastAppOpenAt)) / DAY_MS,
        );

        if (diffDays <= 0) {
          set({ lastAppOpenAt: now });
          return;
        }

        if (diffDays === 1) {
          set({ lastAppOpenAt: now, appOpenStreak: appOpenStreak + 1 });
          return;
        }

        set({ lastAppOpenAt: now, appOpenStreak: 1 });
      },
      setLastSosMode: (mode) => set({ lastSosMode: mode }),
      setNotificationPermissionGranted: (value) => set({ notificationPermissionGranted: value }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
