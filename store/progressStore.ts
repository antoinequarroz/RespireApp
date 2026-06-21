import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { JournalEntry } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

type SosMode = 'breathing' | 'game';

interface ProgressState {
  journalEntries: JournalEntry[];
  celebratedMilestones: string[];
  cravingsHandled: number;
  lastSosMode: SosMode;
  notificationPermissionGranted: boolean;
  addJournalEntry: (entry: JournalEntry) => void;
  markMilestoneCelebrated: (milestoneId: string) => void;
  incrementCravingsHandled: () => void;
  setLastSosMode: (mode: SosMode) => void;
  setNotificationPermissionGranted: (value: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      journalEntries: [],
      celebratedMilestones: [],
      cravingsHandled: 0,
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
      incrementCravingsHandled: () => set({ cravingsHandled: get().cravingsHandled + 1 }),
      setLastSosMode: (mode) => set({ lastSosMode: mode }),
      setNotificationPermissionGranted: (value) => set({ notificationPermissionGranted: value }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
