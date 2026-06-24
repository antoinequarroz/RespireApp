import { useEffect, useMemo, useState } from 'react';

import { MONEY_EQUIVALENTS } from '@/constants/moneyEquivalents';
import { getProductConfig } from '@/constants/productConfig';
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
    const interval = setInterval(() => setRotationIndex((value) => value + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  const moneySaved = useMemo(() => {
    if (!profile || profile.cigarettesPerDay <= 0 || profile.packPrice <= 0) {
      return 0;
    }

    const config = getProductConfig(profile.productType);
    const unitsPerDay =
      config.quantityCadence === 'day'
        ? profile.cigarettesPerDay
        : profile.cigarettesPerDay / 7;
    const unitsAvoided = (counter.totalMs / (24 * 60 * 60 * 1000)) * unitsPerDay;

    return (unitsAvoided / config.unitsPerPrice) * profile.packPrice;
  }, [counter.totalMs, profile]);

  const equivalent = useMemo(
    () => pickMoneyEquivalent(moneySaved, rotationIndex),
    [moneySaved, rotationIndex],
  );

  const series = useMemo(() => getSavingsSeries(profile), [profile]);

  // Equivalents whose amount is within reach (≤ savings × 1.5)
  const filteredEquivalents = useMemo(
    () => MONEY_EQUIVALENTS.filter((item) => item.euros <= Math.max(moneySaved * 1.5, 10)),
    [moneySaved],
  );

  return {
    moneySaved,
    moneySavedFormatted: formatCurrency(moneySaved, profile?.currency ?? 'EUR'),
    equivalent,
    series,
    filteredEquivalents,
  };
}
