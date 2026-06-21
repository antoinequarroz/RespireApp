import { useEffect, useMemo, useState } from 'react';

import { useCounter } from '@/hooks/useCounter';
import {
  formatCurrency,
  getSavingsSeries,
  pickMoneyEquivalent,
} from '@/services/calculations';
import { useUserStore } from '@/store/userStore';

export function useSavings() {
  const profile = useUserStore((state) => state.profile);
  const counter = useCounter();
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotationIndex((value) => value + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const moneySaved = useMemo(
    () => ((profile?.packPrice ?? 0) / 20) * ((profile?.cigarettesPerDay ?? 0) * (counter.totalMs / (24 * 60 * 60 * 1000))),
    [profile, counter.totalMs],
  );

  const equivalent = useMemo(() => pickMoneyEquivalent(moneySaved, rotationIndex), [moneySaved, rotationIndex]);
  const series = useMemo(() => getSavingsSeries(profile), [profile]);

  return {
    moneySaved,
    moneySavedFormatted: formatCurrency(moneySaved),
    equivalent,
    series,
  };
}
