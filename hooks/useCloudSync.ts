import { useEffect, useRef } from 'react';

import { pullAndMerge, pushAll } from '@/services/sync';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

const DEBOUNCE_MS = 3000;

export function useCloudSync() {
  const user = useAuthStore((s) => s.user);
  const setSyncing = useAuthStore((s) => s.setSyncing);

  const profile = useUserStore((s) => s.profile);
  const rewardGoals = useUserStore((s) => s.rewardGoals);
  const language = useUserStore((s) => s.language);
  const currency = useUserStore((s) => s.currency);
  const theme = useUserStore((s) => s.theme);

  const journalEntries = useProgressStore((s) => s.journalEntries);
  const celebratedMilestones = useProgressStore((s) => s.celebratedMilestones);
  const cravingsHandled = useProgressStore((s) => s.cravingsHandled);
  const appOpenStreak = useProgressStore((s) => s.appOpenStreak);
  const lastAppOpenDate = useProgressStore((s) => s.lastAppOpenDate);
  const zenSessionsCompleted = useProgressStore((s) => s.zenSessionsCompleted);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPulled = useRef(false);

  // On login: pull remote data and merge into local stores
  useEffect(() => {
    if (!user || hasPulled.current) return;

    async function pull() {
      if (!user) return;
      setSyncing(true);
      try {
        const remote = await pullAndMerge(user.id);

        // Merge profile: if local has data, skip overwriting (user just onboarded)
        const localProfile = useUserStore.getState().profile;
        if (!localProfile && remote.profile?.last_cigarette_at) {
          useUserStore.getState().setProfile({
            lastCigaretteAt: remote.profile.last_cigarette_at,
            cigarettesPerDay: remote.profile.cigarettes_per_day ?? 10,
            packPrice: remote.profile.pack_price ?? 12,
            productType: (remote.profile.product_type as any) ?? 'cigarette',
            currency: (remote.profile.currency as any) ?? 'EUR',
          });
        }

        // Merge journal: remote entries that aren't in local
        const localDates = new Set(
          useProgressStore.getState().journalEntries.map((e) => e.date),
        );
        for (const entry of remote.journal) {
          if (!localDates.has(entry.date)) {
            useProgressStore.getState().addJournalEntry({
              id: entry.id,
              date: entry.date,
              mood: entry.mood ?? 0,
              craving: entry.craving ?? 0,
              note: entry.note ?? '',
            });
          }
        }

        // Merge celebrated milestones
        if (remote.progress) {
          const localCelebrated = new Set(
            useProgressStore.getState().celebratedMilestones,
          );
          for (const id of remote.progress.celebrated_milestones ?? []) {
            if (!localCelebrated.has(id)) {
              useProgressStore.getState().markMilestoneCelebrated(id);
            }
          }
        }

        // Merge reward goals
        if (remote.rewardGoals.length) {
          const localGoalIds = new Set(
            useUserStore.getState().rewardGoals.map((g) => g.id),
          );
          for (const goal of remote.rewardGoals) {
            if (!localGoalIds.has(goal.id)) {
              useUserStore.getState().addRewardGoal(goal.label, goal.amount);
            }
          }
        }

        hasPulled.current = true;
      } catch {
        // Sync failure is non-fatal: app works offline
      } finally {
        setSyncing(false);
      }
    }

    pull();
  }, [user, setSyncing]);

  // Debounced push on every state change
  useEffect(() => {
    if (!user) return;
    if (!hasPulled.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSyncing(true);
      try {
        await pushAll(user.id, {
          profile,
          prefs: { language, currency, theme },
          celebrated: celebratedMilestones,
          cravingsHandled,
          appOpenStreak,
          lastAppOpenDate,
          zenSessions: zenSessionsCompleted,
          journalEntries,
          rewardGoals,
        });
      } catch {
        // non-fatal
      } finally {
        setSyncing(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    user,
    setSyncing,
    profile,
    rewardGoals,
    language,
    currency,
    theme,
    journalEntries,
    celebratedMilestones,
    cravingsHandled,
    appOpenStreak,
    lastAppOpenDate,
    zenSessionsCompleted,
  ]);
}
