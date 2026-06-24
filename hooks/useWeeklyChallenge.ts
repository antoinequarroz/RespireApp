import { useCallback, useEffect } from 'react';

import { pickWeeklyChallenge, getWeekStart } from '@/constants/weeklyChallenges';
import { useUserLevel } from '@/hooks/useUserLevel';
import { syncWeeklyChallengeNotifications } from '@/services/notifications';
import { useProgressStore } from '@/store/progressStore';

export function useWeeklyChallenge() {
  const weeklyChallenge = useProgressStore((s) => s.weeklyChallenge);
  const setWeeklyChallenge = useProgressStore((s) => s.setWeeklyChallenge);
  const updateWeeklyChallengeProgress = useProgressStore((s) => s.updateWeeklyChallengeProgress);
  const completeWeeklyChallenge = useProgressStore((s) => s.completeWeeklyChallenge);
  const markChallengeCelebrationSeen = useProgressStore((s) => s.markChallengeCelebrationSeen);
  const usedChallengeIds = useProgressStore((s) => s.usedChallengeIds);
  const { level } = useUserLevel();

  const currentWeekStart = getWeekStart();

  useEffect(() => {
    if (weeklyChallenge?.weekStart === currentWeekStart) return;

    const template = pickWeeklyChallenge(level, currentWeekStart, usedChallengeIds);
    const newChallenge = {
      id: template.id,
      label: template.label,
      target: template.target,
      current: 0,
      weekStart: currentWeekStart,
      completed: false,
      celebrationSeen: false,
    };
    setWeeklyChallenge(newChallenge);
    syncWeeklyChallengeNotifications(newChallenge, template.target).catch(() => undefined);
  }, [currentWeekStart, level, setWeeklyChallenge, usedChallengeIds, weeklyChallenge?.weekStart]);

  const incrementProgress = useCallback(
    (n = 1) => {
      if (!weeklyChallenge || weeklyChallenge.completed) return;
      const next = weeklyChallenge.current + n;
      updateWeeklyChallengeProgress(next);
      if (next >= weeklyChallenge.target) {
        completeWeeklyChallenge();
      }
    },
    [weeklyChallenge, updateWeeklyChallengeProgress, completeWeeklyChallenge],
  );

  return {
    weeklyChallenge,
    incrementProgress,
    markCelebrationSeen: markChallengeCelebrationSeen,
  };
}
