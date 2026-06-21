import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { getCounterBreakdown } from '@/services/calculations';
import { useUserStore } from '@/store/userStore';

export function useCounter() {
  const profile = useUserStore((state) => state.profile);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    const subscription = AppState.addEventListener('change', () => setNow(Date.now()));

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return useMemo(() => getCounterBreakdown(profile?.lastCigaretteAt, now), [now, profile]);
}
