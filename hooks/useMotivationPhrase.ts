import { useCallback, useMemo } from 'react';

import { pickMotivationPhrase, type PhrasePickResult, type PhraseTrigger } from '@/constants/motivationPhrases';
import { useCounter } from '@/hooks/useCounter';
import { useSavings } from '@/hooks/useSavings';
import { getAvoidedCigarettes } from '@/services/calculations';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

export interface UseMotivationPhraseResult extends PhrasePickResult {
  markUsed: () => void;
}

export function useMotivationPhrase(trigger?: PhraseTrigger): UseMotivationPhraseResult {
  const profile = useUserStore((s) => s.profile);
  const notifCategories = useUserStore((s) => s.notifCategories);
  const getRecentUsedPhraseIds = useProgressStore((s) => s.getRecentUsedPhraseIds);
  const markMotivationPhraseUsed = useProgressStore((s) => s.markMotivationPhraseUsed);
  const weeklyChallenge = useProgressStore((s) => s.weeklyChallenge);
  const counter = useCounter();
  const { moneySaved, moneySavedFormatted, equivalent } = useSavings();

  const cigarettesAvoided = getAvoidedCigarettes(
    profile?.lastCigaretteAt,
    profile?.cigarettesPerDay,
    profile?.productType,
  );

  // Pick once per trigger + day change. usedPhraseIds are read at pick time via getState().
  const phrase = useMemo(() => {
    return pickMotivationPhrase({
      smokeFreeDays: counter.days,
      cigarettesAvoided,
      moneySaved,
      savings: moneySavedFormatted,
      equivalent: equivalent.labelFr,
      trigger,
      usedPhraseIds: getRecentUsedPhraseIds(),
      hourOfDay: new Date().getHours(),
      motivations: profile?.motivations ?? [],
      notifCategories,
      activeChallengeLabel: weeklyChallenge?.label,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, counter.days]);

  const markUsed = useCallback(() => {
    markMotivationPhraseUsed(phrase.id);
  }, [markMotivationPhraseUsed, phrase.id]);

  return { ...phrase, markUsed };
}
