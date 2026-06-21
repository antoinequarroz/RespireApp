import { useMemo } from 'react';

import { useCounter } from '@/hooks/useCounter';
import { getReachedHealthSteps } from '@/services/calculations';

export function useHealthStats() {
  const counter = useCounter();

  return useMemo(() => {
    const timeline = getReachedHealthSteps(counter.totalMs);
    const next = timeline.find((item) => !item.reached) ?? timeline[timeline.length - 1];
    const completed = timeline.filter((item) => item.reached).length;

    return {
      timeline,
      next,
      completed,
      progressRatio: timeline.length === 0 ? 0 : completed / timeline.length,
    };
  }, [counter.totalMs]);
}
