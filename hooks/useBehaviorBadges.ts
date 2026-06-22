import { useMemo } from 'react';

import { BEHAVIOR_BADGES } from '@/constants/behaviorBadges';
import { useSavings } from '@/hooks/useSavings';
import { useProgressStore } from '@/store/progressStore';

export function useBehaviorBadges() {
  const { moneySaved } = useSavings();
  const appOpenStreak = useProgressStore((state) => state.appOpenStreak);
  const zenSessionsCompleted = useProgressStore((state) => state.zenSessionsCompleted);
  const cravingsHandled = useProgressStore((state) => state.cravingsHandled);
  const journalEntries = useProgressStore((state) => state.journalEntries);

  return useMemo(() => {
    const badges = BEHAVIOR_BADGES.map((badge) => {
      let reached = false;

      switch (badge.id) {
        case 'zen_master':
          reached = zenSessionsCompleted >= 10;
          break;
        case 'economiste':
          reached = moneySaved >= 100;
          break;
        case 'millionnaire':
          reached = moneySaved >= 1000;
          break;
        case 'journal_pro':
          reached = journalEntries.length >= 30;
          break;
        case 'sos_survivor':
          reached = cravingsHandled >= 5;
          break;
        case 'gardien':
          reached = appOpenStreak >= 7;
          break;
      }

      return { ...badge, reached };
    });

    return {
      badges,
      unlocked: badges.filter((badge) => badge.reached),
    };
  }, [appOpenStreak, cravingsHandled, journalEntries.length, moneySaved, zenSessionsCompleted]);
}
