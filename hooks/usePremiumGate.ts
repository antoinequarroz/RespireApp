import type { PremiumGate } from '@/constants/premiumGates';
import { PREMIUM_GATES } from '@/constants/premiumGates';
import { usePremiumStore } from '@/store/premiumStore';

export function usePremiumGate(gate: PremiumGate): boolean {
  const isPremium = usePremiumStore((s) => s.isPremium);
  return !PREMIUM_GATES[gate] || isPremium;
}
