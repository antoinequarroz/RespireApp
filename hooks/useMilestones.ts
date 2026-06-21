import { useMemo } from 'react';

import { useCounter } from '@/hooks/useCounter';
import { getMilestonesProgress } from '@/services/calculations';
import { useProgressStore } from '@/store/progressStore';

export function useMilestones() {
  const counter = useCounter();
  const celebratedMilestones = useProgressStore((state) => state.celebratedMilestones);

  return useMemo(() => {
    const data = getMilestonesProgress(counter.totalMs);
    const unlocked = data.milestones.filter((item) => item.reached);
    const nextToCelebrate = unlocked.find((item) => !celebratedMilestones.includes(item.id));

    return {
      ...data,
      unlocked,
      nextToCelebrate,
    };
  }, [celebratedMilestones, counter.totalMs]);
}
