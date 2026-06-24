import { useEffect, useRef, useState } from 'react';

import { useProgressStore } from '@/store/progressStore';

type SosMode = 'breathing' | 'game';

const SOS_DURATION_S = 180;

export function useSos() {
  const lastSosMode = useProgressStore((state) => state.lastSosMode);
  const setLastSosMode = useProgressStore((state) => state.setLastSosMode);
  const incrementCravingsHandled = useProgressStore((state) => state.incrementCravingsHandled);
  const [mode, setModeState] = useState<SosMode>(lastSosMode);
  const [sessionDone, setSessionDone] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    sessionStartRef.current = Date.now();
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      const s = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      setElapsedSeconds(s);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = Math.max(0, SOS_DURATION_S - elapsedSeconds);

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
    elapsedSeconds,
    countdown,
    setMode,
    completeSession,
  };
}
