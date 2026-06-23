export const BEHAVIOR_BADGES = [
  // ─── Temps / régularité ──────────────────────────────────────────────────────
  {
    id: 'gardien_3',
    labelFr: 'Gardien',
    emoji: '🔥',
    descriptionFr: "3 jours d'app ouverte d'affilée",
    condition: 'appOpenStreak >= 3',
  },
  {
    id: 'gardien_7',
    labelFr: 'Sentinelle',
    emoji: '🛡️',
    descriptionFr: "7 jours d'app ouverte consécutifs",
    condition: 'appOpenStreak >= 7',
  },
  {
    id: 'gardien_30',
    labelFr: 'Inébranlable',
    emoji: '🏔️',
    descriptionFr: "30 jours d'app ouverte consécutifs",
    condition: 'appOpenStreak >= 30',
  },

  // ─── SOS / cravings ──────────────────────────────────────────────────────────
  {
    id: 'sos_1',
    labelFr: 'Premier souffle',
    emoji: '💨',
    descriptionFr: "1er mode SOS complété",
    condition: 'cravingsHandled >= 1',
  },
  {
    id: 'sos_5',
    labelFr: 'SOS Survivor',
    emoji: '⚡',
    descriptionFr: "5 cravings traversés avec l'app",
    condition: 'cravingsHandled >= 5',
  },
  {
    id: 'sos_20',
    labelFr: 'Maître du craving',
    emoji: '🧠',
    descriptionFr: "20 cravings gérés sans craquer",
    condition: 'cravingsHandled >= 20',
  },

  // ─── Zen / respiration ───────────────────────────────────────────────────────
  {
    id: 'zen_1',
    labelFr: 'Première expiration',
    emoji: '🌬️',
    descriptionFr: "1ère session de respiration terminée",
    condition: 'zenSessionsCompleted >= 1',
  },
  {
    id: 'zen_master',
    labelFr: 'Zen Master',
    emoji: '🧘',
    descriptionFr: "10 sessions de respiration complétées",
    condition: 'zenSessionsCompleted >= 10',
  },
  {
    id: 'zen_50',
    labelFr: 'Moine du souffle',
    emoji: '🪷',
    descriptionFr: "50 sessions de respiration complétées",
    condition: 'zenSessionsCompleted >= 50',
  },

  // ─── Argent ──────────────────────────────────────────────────────────────────
  {
    id: 'economiste',
    labelFr: 'Économiste',
    emoji: '💰',
    descriptionFr: '100 EUR économisés',
    condition: 'moneySaved >= 100',
  },
  {
    id: 'capitaliste',
    labelFr: 'Capitaliste',
    emoji: '💎',
    descriptionFr: '500 EUR économisés',
    condition: 'moneySaved >= 500',
  },
  {
    id: 'millionnaire',
    labelFr: 'Millionnaire',
    emoji: '🏦',
    descriptionFr: '1000 EUR économisés',
    condition: 'moneySaved >= 1000',
  },

  // ─── Journal ─────────────────────────────────────────────────────────────────
  {
    id: 'journal_7',
    labelFr: 'Chroniqueur',
    emoji: '📓',
    descriptionFr: '7 entrées de journal',
    condition: 'journalEntries >= 7',
  },
  {
    id: 'journal_30',
    labelFr: 'Journal Pro',
    emoji: '📖',
    descriptionFr: '30 entrées de journal',
    condition: 'journalEntries >= 30',
  },
  {
    id: 'journal_100',
    labelFr: 'Mémorialiste',
    emoji: '🗂️',
    descriptionFr: '100 entrées de journal',
    condition: 'journalEntries >= 100',
  },
] as const;

export type BehaviorBadgeId = (typeof BEHAVIOR_BADGES)[number]['id'];
