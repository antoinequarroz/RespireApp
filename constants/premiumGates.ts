export const PREMIUM_GATES = {
  journal: true,
  journalInsights: true,
  journalExport: true,
  zenWimHof: true,
  streakProtection: true,
  statsDetailed: true,
  statsExport: true,
  multiRewardGoals: true,
  notifCategories: true,
} as const;

export type PremiumGate = keyof typeof PREMIUM_GATES;

export const PREMIUM_GATE_LABELS: Record<PremiumGate, string> = {
  journal: 'Journal',
  journalInsights: 'Insights journal',
  journalExport: 'Export journal',
  zenWimHof: 'Technique Wim Hof',
  streakProtection: 'Protection de streak (2j/mois)',
  statsDetailed: 'Stats détaillées 30j+',
  statsExport: 'Export statistiques',
  multiRewardGoals: 'Objectifs cagnotte multiples',
  notifCategories: 'Types de notifications',
};
