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
  const celebratedBadgeIds = useProgressStore((state) => state.celebratedBadgeIds);

  return useMemo(() => {
    const j = journalEntries.length;

    const badges = BEHAVIOR_BADGES.map((badge) => {
      let reached = false;

      switch (badge.id) {
        case 'gardien_3':    reached = appOpenStreak >= 3;       break;
        case 'gardien_7':    reached = appOpenStreak >= 7;       break;
        case 'gardien_30':   reached = appOpenStreak >= 30;      break;
        case 'sos_1':        reached = cravingsHandled >= 1;     break;
        case 'sos_5':        reached = cravingsHandled >= 5;     break;
        case 'sos_20':       reached = cravingsHandled >= 20;    break;
        case 'zen_1':        reached = zenSessionsCompleted >= 1;  break;
        case 'zen_master':   reached = zenSessionsCompleted >= 10; break;
        case 'zen_50':       reached = zenSessionsCompleted >= 50; break;
        case 'economiste':   reached = moneySaved >= 100;        break;
        case 'capitaliste':  reached = moneySaved >= 500;        break;
        case 'millionnaire': reached = moneySaved >= 1000;       break;
        case 'journal_7':    reached = j >= 7;                   break;
        case 'journal_30':   reached = j >= 30;                  break;
        case 'journal_100':  reached = j >= 100;                 break;
      }

      return { ...badge, reached, celebrated: celebratedBadgeIds.includes(badge.id) };
    });

    const unlocked = badges.filter((b) => b.reached);
    const newlyUnlocked = unlocked.filter((b) => !b.celebrated);

    return { badges, unlocked, newlyUnlocked };
  }, [appOpenStreak, celebratedBadgeIds, cravingsHandled, journalEntries.length, moneySaved, zenSessionsCompleted]);
}
