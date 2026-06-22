import { useState } from 'react';

import { useProgressStore } from '@/store/progressStore';

type SosMode = 'breathing' | 'game';

export function useSos() {
  const lastSosMode = useProgressStore((state) => state.lastSosMode);
  const setLastSosMode = useProgressStore((state) => state.setLastSosMode);
  const incrementCravingsHandled = useProgressStore((state) => state.incrementCravingsHandled);
  const [mode, setModeState] = useState<SosMode>(lastSosMode);
  const [sessionDone, setSessionDone] = useState(false);

  const setMode = (value: SosMode) => {
    setModeState(value);
    setLastSosMode(value);
    setSessionDone(false);
  };

  const completeSession = () => {
    if (!sessionDone) {
      incrementCravingsHandled();
      setSessionDone(true);
    }
  };

  return {
    mode,
    sessionDone,
    setMode,
    completeSession,
  };
}
