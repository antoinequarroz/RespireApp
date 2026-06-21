import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/services/storage';

interface PremiumPackageSummary {
  identifier: string;
  title: string;
  priceString: string;
}

interface PremiumState {
  isPremium: boolean;
  offerings: PremiumPackageSummary[];
  lastSyncAt?: string;
  setPremiumStatus: (value: boolean) => void;
  setOfferings: (offerings: PremiumPackageSummary[]) => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,
      offerings: [],
      setPremiumStatus: (value) =>
        set({
          isPremium: value,
          lastSyncAt: new Date().toISOString(),
        }),
      setOfferings: (offerings) =>
        set({
          offerings,
          lastSyncAt: new Date().toISOString(),
        }),
    }),
    {
      name: STORAGE_KEYS.premium,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
