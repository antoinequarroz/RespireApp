import type { ProductType } from '@/constants/productConfig';

export type PhraseCategory =
  | 'day1'
  | 'day2_3'
  | 'week1'
  | 'week2'
  | 'month1'
  | 'month3'
  | 'month6'
  | 'year1'
  | 'general'
  | 'zen'
  | 'relapse'
  | 'postSos'
  | 'morning'
  | 'evening';

export type PhraseTrigger = 'sos' | 'relapse' | 'milestone' | 'daily' | 'any';

export interface MotivationPhrase {
  id: string;
  text: string;
  category: PhraseCategory;
  minDay?: number;
  maxDay?: number;
  timeOfDay?: 'morning' | 'evening' | 'any';
  trigger?: PhraseTrigger;
  productTypes?: ProductType[];
}

export interface StatPhrase {
  id: string;
  template: string;
}

export const MOTIVATION_PHRASES: MotivationPhrase[] = [
  // ─── DAY 1 ───────────────────────────────────────────────────────────────────
  { id: 'mp-d1-01', category: 'day1', minDay: 0, maxDay: 1, trigger: 'daily',
    text: "Les premières 24h sont les plus dures. Tu es déjà en train de les traverser." },
  { id: 'mp-d1-02', category: 'day1', minDay: 0, maxDay: 1,
    text: "Dans 20 minutes, ta tension artérielle se normalise. Ton corps a déjà commencé." },
  { id: 'mp-d1-03', category: 'day1', minDay: 0, maxDay: 1,
    text: "Un jour à la fois. Juste aujourd'hui." },
  { id: 'mp-d1-04', category: 'day1', minDay: 0, maxDay: 1,
    text: "Le sevrage, c'est ton corps qui guérit. Chaque inconfort est un signe que ça marche." },
  { id: 'mp-d1-05', category: 'day1', minDay: 0, maxDay: 1,
    text: "Tu n'as pas besoin de tenir un an. Tu as besoin de tenir la prochaine heure." },
  { id: 'mp-d1-06', category: 'day1', minDay: 0, maxDay: 1,
    text: "Ton cerveau réclame de la nicotine. Pas toi. La différence, c'est toi qui la fait." },

  // ─── DAYS 2–3 ────────────────────────────────────────────────────────────────
  { id: 'mp-d23-01', category: 'day2_3', minDay: 1, maxDay: 3,
    text: "48h. Le CO a quitté ton sang. Tu respires mieux, même si tu ne le sens pas encore." },
  { id: 'mp-d23-02', category: 'day2_3', minDay: 1, maxDay: 3,
    text: "L'envie dure 3 minutes. Juste 3. Tu peux les tenir." },
  { id: 'mp-d23-03', category: 'day2_3', minDay: 1, maxDay: 3,
    text: "Ton corps est en sevrage. C'est réel, c'est physique. Et ça s'arrête bientôt." },
  { id: 'mp-d23-04', category: 'day2_3', minDay: 1, maxDay: 3, timeOfDay: 'evening',
    text: "Tu as traversé une autre journée. Le plus dur est derrière toi." },
  { id: 'mp-d23-05', category: 'day2_3', minDay: 1, maxDay: 3,
    text: "Le pic d'irritabilité dure 72h. Tu es presque sorti de l'autre côté." },
  { id: 'mp-d23-06', category: 'day2_3', minDay: 1, maxDay: 3,
    text: "Chaque envie que tu laisses passer sans céder reconfigure ton cerveau. Pour de bon." },

  // ─── WEEK 1 ──────────────────────────────────────────────────────────────────
  { id: 'mp-w1-01', category: 'week1', minDay: 4, maxDay: 14,
    text: "7 jours. 168 heures de pure force mentale." },
  { id: 'mp-w1-02', category: 'week1', minDay: 4, maxDay: 14,
    text: "Tes cils bronchiques se régénèrent. Dans quelques semaines, tu tousseras moins." },
  { id: 'mp-w1-03', category: 'week1', minDay: 4, maxDay: 14,
    text: "La semaine la plus difficile est derrière toi. Maintenant, tu construis." },
  { id: 'mp-w1-04', category: 'week1', minDay: 4, maxDay: 14,
    text: "Le manque physique de nicotine dure 5 à 7 jours. Tu en es là. C'est le pic." },
  { id: 'mp-w1-05', category: 'week1', minDay: 4, maxDay: 14,
    text: "Les fumeurs qui passent 7 jours ont 9x plus de chances de réussir définitivement." },
  { id: 'mp-w1-06', category: 'week1', minDay: 4, maxDay: 14,
    text: "Tu vas voir des moments de calme apparaître entre les envies. C'est ça, la liberté." },

  // ─── WEEK 2 ──────────────────────────────────────────────────────────────────
  { id: 'mp-w2-01', category: 'week2', minDay: 8, maxDay: 21,
    text: "Le manque physique est presque parti. Ce qui reste, c'est l'habitude. C'est différent — et plus gérable." },
  { id: 'mp-w2-02', category: 'week2', minDay: 8, maxDay: 21,
    text: "2 semaines. Ta circulation s'améliore. Tu grimpes mieux, tu cours mieux." },
  { id: 'mp-w2-03', category: 'week2', minDay: 8, maxDay: 21,
    text: "Les envies arrivent encore ? Normal. Mais elles durent moins longtemps, non ?" },
  { id: 'mp-w2-04', category: 'week2', minDay: 8, maxDay: 21,
    text: "Ton goût et ton odorat sont de retour. Profites-en — c'est concret, ça." },
  { id: 'mp-w2-05', category: 'week2', minDay: 8, maxDay: 21,
    text: "Tu as redéfini ce que « une pause » veut dire. Tu n'en avais jamais eu besoin." },

  // ─── MONTH 1 ─────────────────────────────────────────────────────────────────
  { id: 'mp-m1-01', category: 'month1', minDay: 29, maxDay: 60,
    text: "Un mois. 30 jours de décision consciente chaque matin." },
  { id: 'mp-m1-02', category: 'month1', minDay: 29, maxDay: 60,
    text: "Tes poumons produisent moins de mucus. Tu tousses moins. Tu dors mieux." },
  { id: 'mp-m1-03', category: 'month1', minDay: 29, maxDay: 60,
    text: "30 jours, c'est la preuve que tu peux. Pas juste pour toi. Pour tout le monde qui doute encore." },
  { id: 'mp-m1-04', category: 'month1', minDay: 29, maxDay: 60,
    text: "Ton énergie remonte. Ton sommeil s'améliore. Ce n'est pas un hasard." },
  { id: 'mp-m1-05', category: 'month1', minDay: 29, maxDay: 60,
    text: "Un mois sans fumée. Ton cœur bat plus régulièrement. Littéralement." },

  // ─── MONTH 3 ─────────────────────────────────────────────────────────────────
  { id: 'mp-m3-01', category: 'month3', minDay: 89, maxDay: 180,
    text: "3 mois. Ta fertilité est remontée. Ton endurance aussi." },
  { id: 'mp-m3-02', category: 'month3', minDay: 89, maxDay: 180,
    text: "Les envies sont devenues des souvenirs. Pas des urgences." },
  { id: 'mp-m3-03', category: 'month3', minDay: 89, maxDay: 180,
    text: "90 jours. Il y a 3 mois, tu te demandais si tu pouvais. Maintenant tu sais." },
  { id: 'mp-m3-04', category: 'month3', minDay: 89, maxDay: 180,
    text: "Tu as traversé des fêtes, des stress, des déjeuners. Et tu n'as pas fumé." },

  // ─── MONTH 6 ─────────────────────────────────────────────────────────────────
  { id: 'mp-m6-01', category: 'month6', minDay: 179, maxDay: 365,
    text: "180 jours. Ton risque d'infarctus est déjà réduit. Tu as changé ton futur." },
  { id: 'mp-m6-02', category: 'month6', minDay: 179, maxDay: 365,
    text: "6 mois. Certains jours ont été durs. Tu les as tous traversés." },
  { id: 'mp-m6-03', category: 'month6', minDay: 179, maxDay: 365,
    text: "Tu n'es plus un fumeur qui essaie d'arrêter. Tu es quelqu'un qui ne fume pas." },

  // ─── YEAR 1+ ─────────────────────────────────────────────────────────────────
  { id: 'mp-y1-01', category: 'year1', minDay: 364,
    text: "Un an. 365 décisions de te choisir, toi." },
  { id: 'mp-y1-02', category: 'year1', minDay: 364,
    text: "Ton risque de maladie coronaire vient d'être divisé par 2. Littéralement." },
  { id: 'mp-y1-03', category: 'year1', minDay: 364,
    text: "Un an. Ce que tu as construit ici ne s'efface pas." },

  // ─── GENERAL ─────────────────────────────────────────────────────────────────
  { id: 'mp-g-01', category: 'general', text: "Tu tiens. C'est tout ce qui compte." },
  { id: 'mp-g-02', category: 'general', text: "Chaque seconde sans fumer est une victoire réelle." },
  { id: 'mp-g-03', category: 'general', text: "Une envie ? Respire. Elle passe toujours." },
  { id: 'mp-g-04', category: 'general', text: "Tu es plus fort que le réflexe." },
  { id: 'mp-g-05', category: 'general', text: "Ce n'est pas une privation. C'est une libération." },
  { id: 'mp-g-06', category: 'general', text: "Tu n'avais pas besoin de cigarette. Tu en avais l'habitude. C'est différent." },
  { id: 'mp-g-07', category: 'general', text: "La cigarette mentait. Tu n'as jamais eu besoin d'elle." },
  { id: 'mp-g-08', category: 'general', text: "Ce que tu fais est difficile. Et tu le fais quand même." },
  { id: 'mp-g-09', category: 'general', text: "Tu réécris ton histoire, une heure à la fois." },
  { id: 'mp-g-10', category: 'general', text: "Fier de toi. Pour de vrai." },
  { id: 'mp-g-11', category: 'general', text: "Une heure, puis une autre. C'est ça le secret." },
  { id: 'mp-g-12', category: 'general', text: "La difficulté d'aujourd'hui, c'est la force de demain." },
  { id: 'mp-g-13', category: 'general', text: "Ton futur toi te remercie déjà." },
  { id: 'mp-g-14', category: 'general', text: "Tu n'es pas en train de résister. Tu es en train de choisir." },
  { id: 'mp-g-15', category: 'general', text: "Le corps guérit. Le mental suit. Laisse le temps faire." },
  { id: 'mp-g-16', category: 'general', text: "Tu as décidé que ta santé valait plus qu'un paquet." },
  { id: 'mp-g-17', category: 'general', text: "Chaque craving passé sans craquer, c'est un neurone recâblé." },
  { id: 'mp-g-18', category: 'general', text: "Ce compteur ne ment pas. Tu avances." },
  { id: 'mp-g-19', category: 'general', text: "Pas parfait. Juste meilleur qu'hier. C'est assez." },
  { id: 'mp-g-20', category: 'general', text: "Tu as choisi la vie sur le long terme. C'est rare et c'est courageux." },
  { id: 'mp-g-21', category: 'general', text: "Rappelle-toi pourquoi tu as commencé. Ça tient toujours." },
  { id: 'mp-g-22', category: 'general', text: "Les gens qui arrêtent ne sont pas différents. Ils ont juste continué un jour de plus." },
  { id: 'mp-g-23', category: 'general', text: "La nicotine dure 72h dans ton corps. Tout le reste, c'est mental. Et le mental, tu le contrôles." },

  // ─── ZEN / BREATHING ─────────────────────────────────────────────────────────
  { id: 'mp-z-01', category: 'zen', trigger: 'sos', text: "Inspire... Tu es en sécurité." },
  { id: 'mp-z-02', category: 'zen', trigger: 'sos', text: "Cette envie va passer. Respire avec elle." },
  { id: 'mp-z-03', category: 'zen', text: "4 secondes d'inspire. 4 secondes d'expire. La chimie change." },
  { id: 'mp-z-04', category: 'zen', text: "Calme. Puissant. Libre." },
  { id: 'mp-z-05', category: 'zen', text: "Ferme les yeux. Inspire par le nez. Expire lentement. Tu peux." },
  { id: 'mp-z-06', category: 'zen', text: "La respiration casse le circuit du craving. Trois cycles, et tu es de l'autre côté." },
  { id: 'mp-z-07', category: 'zen', text: "Ce moment difficile est temporaire. Ton corps retrouve l'équilibre." },

  // ─── POST-SOS ────────────────────────────────────────────────────────────────
  { id: 'mp-ps-01', category: 'postSos', trigger: 'sos',
    text: "Tu viens de traverser une envie sans craquer. Elle a duré moins de 5 minutes." },
  { id: 'mp-ps-02', category: 'postSos', trigger: 'sos',
    text: "Ce moment difficile est passé. Tu l'as géré. Note-le quelque part." },
  { id: 'mp-ps-03', category: 'postSos', trigger: 'sos',
    text: "Chaque envie traversée rend la prochaine plus facile à tenir." },
  { id: 'mp-ps-04', category: 'postSos', trigger: 'sos',
    text: "Tu n'as pas fléchi. Ton cerveau vient d'apprendre que tu es plus fort que lui." },
  { id: 'mp-ps-05', category: 'postSos', trigger: 'sos',
    text: "C'est fait. Une de plus dans les livres." },

  // ─── RECHUTE ─────────────────────────────────────────────────────────────────
  { id: 'mp-r-01', category: 'relapse', trigger: 'relapse',
    text: "Une rechute n'efface pas tout ce que tu as construit. Recommence maintenant." },
  { id: 'mp-r-02', category: 'relapse', trigger: 'relapse',
    text: "Les gens qui réussissent à arrêter font en moyenne 3 tentatives. Tu apprends." },
  { id: 'mp-r-03', category: 'relapse', trigger: 'relapse',
    text: "Ce n'est pas un échec. C'est de l'information. Qu'est-ce qui s'est passé ?" },
  { id: 'mp-r-04', category: 'relapse', trigger: 'relapse',
    text: "Tu es revenu ici. C'est ce qui compte vraiment." },
  { id: 'mp-r-05', category: 'relapse', trigger: 'relapse',
    text: "Chaque tentative t'apprend quelque chose sur toi. Celle-ci aussi." },
  { id: 'mp-r-06', category: 'relapse', trigger: 'relapse',
    text: "Le compteur repart. Mais ce que tu as appris, lui, reste." },

  // ─── MATIN ───────────────────────────────────────────────────────────────────
  { id: 'mp-am-01', category: 'morning', timeOfDay: 'morning',
    text: "Nouvelle journée. Aucune cigarette aujourd'hui — c'est tout ce qu'on te demande." },
  { id: 'mp-am-02', category: 'morning', timeOfDay: 'morning',
    text: "Ce matin, ton corps est plus propre qu'hier. Encore une journée." },
  { id: 'mp-am-03', category: 'morning', timeOfDay: 'morning',
    text: "Aujourd'hui tu choisis ta santé. Une fois de plus." },
  { id: 'mp-am-04', category: 'morning', timeOfDay: 'morning',
    text: "Bonjour. Tu te réveilles sans nicotine dans le sang. C'est déjà une victoire." },
  { id: 'mp-am-05', category: 'morning', timeOfDay: 'morning',
    text: "Ce matin commence proprement. Garde-le comme ça." },
  { id: 'mp-am-06', category: 'morning', timeOfDay: 'morning',
    text: "Premier moment difficile de la journée ? Respire. Bois de l'eau. Passe à la suite." },
  { id: 'mp-am-07', category: 'morning', timeOfDay: 'morning',
    text: "Le matin sans cigarette, c'est le matin que tu mérites vraiment." },
  { id: 'mp-am-08', category: 'morning', timeOfDay: 'morning',
    text: "Une journée de plus à construire quelque chose qui en vaut la peine." },

  // ─── SOIR ────────────────────────────────────────────────────────────────────
  { id: 'mp-pm-01', category: 'evening', timeOfDay: 'evening',
    text: "Tu arrives au bout de cette journée. Sans fumer. C'est concret." },
  { id: 'mp-pm-02', category: 'evening', timeOfDay: 'evening',
    text: "Ce soir, tu peux être fier. Demain recommence à zéro — et c'est parfait." },
  { id: 'mp-pm-03', category: 'evening', timeOfDay: 'evening',
    text: "Une journée de plus dans les livres. Bien joué." },
  { id: 'mp-pm-04', category: 'evening', timeOfDay: 'evening',
    text: "Ce soir, ta pression artérielle est plus basse que si tu avais fumé. Ça se voit pas, mais ça compte." },
  { id: 'mp-pm-05', category: 'evening', timeOfDay: 'evening',
    text: "Toutes les envies d'aujourd'hui ? Traversées. Toutes." },
  { id: 'mp-pm-06', category: 'evening', timeOfDay: 'evening',
    text: "Dors bien. Demain, tu recommences — avec une journée de plus dans le dos." },
  { id: 'mp-pm-07', category: 'evening', timeOfDay: 'evening',
    text: "Cette journée est dans ta colonne victoire. Pour toujours." },
];

export const STAT_PHRASES: StatPhrase[] = [
  { id: 'sp-01', template: "Cette semaine : {{cigarettesAvoided}} cigarettes évitées. {{savings}} dans ta poche." },
  { id: 'sp-02', template: "Depuis que tu as arrêté, tu as économisé l'équivalent de {{equivalent}}." },
  { id: 'sp-03', template: "{{dayCount}} jours. C'est {{cigarettesAvoided}} cigarettes que ton corps n'a pas eu à gérer." },
  { id: 'sp-04', template: "{{savings}} économisés. Tu te rapproches de ton objectif." },
  { id: 'sp-05', template: "{{dayCount}} jours sans fumer. Ton corps te dit merci {{cigarettesAvoided}} fois." },
  { id: 'sp-06', template: "{{cigarettesAvoided}} cigarettes évitées. Chacune avait un coût, tu les as toutes refusées." },
  { id: 'sp-07', template: "{{savings}} que tu n'as pas brûlé. Littéralement." },
];

// ─── Pick context ────────────────────────────────────────────────────────────

export interface PhrasePickContext {
  smokeFreeDays: number;
  cigarettesAvoided: number;
  moneySaved: number;
  savings: string;
  equivalent: string;
  trigger?: PhraseTrigger;
  usedPhraseIds: string[];
  hourOfDay?: number;
  motivations?: string[];
  notifCategories?: {
    contextual: boolean;
    general: boolean;
    statBased: boolean;
    challenges: boolean;
  };
  activeChallengeLabel?: string;
}

export interface PhrasePickResult {
  id: string;
  text: string;
  category: PhraseCategory | 'stat' | 'challenge';
  isPersonalStat: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function freshPool(pool: MotivationPhrase[], usedIds: string[]): MotivationPhrase[] {
  const fresh = pool.filter((p) => !usedIds.includes(p.id));
  return fresh.length > 0 ? fresh : pool;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatStat(template: string, ctx: PhrasePickContext): string {
  return template
    .replace('{{cigarettesAvoided}}', String(Math.round(ctx.cigarettesAvoided)))
    .replace('{{dayCount}}', String(ctx.smokeFreeDays))
    .replace('{{savings}}', ctx.savings)
    .replace('{{equivalent}}', ctx.equivalent);
}

function isHealthMotivated(motivations: string[]): boolean {
  return motivations.some((m) =>
    ['sant', 'health', 'sport', 'famille', 'family'].some((k) => m.toLowerCase().includes(k)),
  );
}

function isMoneyMotivated(motivations: string[]): boolean {
  return motivations.some((m) =>
    ['argent', 'money', 'écon', 'libert'].some((k) => m.toLowerCase().includes(k)),
  );
}

// ─── Main pick function (pure — usable outside React) ────────────────────────

export function pickMotivationPhrase(ctx: PhrasePickContext): PhrasePickResult {
  const hour = ctx.hourOfDay ?? new Date().getHours();
  const {
    smokeFreeDays,
    trigger,
    usedPhraseIds,
    motivations = [],
    notifCategories,
    activeChallengeLabel,
  } = ctx;

  // 1. Trigger overrides
  if (trigger === 'relapse') {
    const pool = freshPool(
      MOTIVATION_PHRASES.filter((p) => p.category === 'relapse'),
      usedPhraseIds,
    );
    const pick = pickRandom(pool);
    return { id: pick.id, text: pick.text, category: 'relapse', isPersonalStat: false };
  }

  if (trigger === 'sos') {
    const pool = freshPool(
      MOTIVATION_PHRASES.filter((p) => p.category === 'postSos' || p.category === 'zen'),
      usedPhraseIds,
    );
    const pick = pickRandom(pool);
    return { id: pick.id, text: pick.text, category: pick.category, isPersonalStat: false };
  }

  // 2. Time-of-day priority
  const allowContextual = notifCategories?.contextual !== false;
  const allowGeneral = notifCategories?.general !== false;
  const allowStat = notifCategories?.statBased !== false;
  const allowChallenge = notifCategories?.challenges !== false;

  if (allowContextual) {
    if (hour < 10) {
      const pool = freshPool(
        MOTIVATION_PHRASES.filter((p) => p.category === 'morning'),
        usedPhraseIds,
      );
      if (pool.length > 0) {
        const pick = pickRandom(pool);
        return { id: pick.id, text: pick.text, category: 'morning', isPersonalStat: false };
      }
    }

    if (hour >= 20) {
      const pool = freshPool(
        MOTIVATION_PHRASES.filter((p) => p.category === 'evening'),
        usedPhraseIds,
      );
      if (pool.length > 0) {
        const pick = pickRandom(pool);
        return { id: pick.id, text: pick.text, category: 'evening', isPersonalStat: false };
      }
    }
  }

  // 3. Weighted random
  const healthBoost = isHealthMotivated(motivations) ? 0.10 : 0;
  const moneyBoost = isMoneyMotivated(motivations) ? 0.10 : 0;

  const statWeight = Math.min(0.30, 0.20 + moneyBoost);
  const challengeWeight = allowChallenge && activeChallengeLabel ? 0.10 : 0;
  const contextualWeight = Math.min(0.40, 0.30 + healthBoost);

  const rand = Math.random();
  let threshold = 0;

  threshold += challengeWeight;
  if (rand < threshold && activeChallengeLabel) {
    return {
      id: 'challenge-hint',
      text: `Cette semaine : ${activeChallengeLabel}. Tu peux le faire.`,
      category: 'challenge',
      isPersonalStat: false,
    };
  }

  threshold += allowStat ? statWeight : 0;
  if (rand < threshold && allowStat) {
    const template = pickRandom(STAT_PHRASES);
    return {
      id: template.id,
      text: formatStat(template.template, ctx),
      category: 'stat',
      isPersonalStat: true,
    };
  }

  threshold += allowContextual ? contextualWeight : 0;
  if (rand < threshold && allowContextual) {
    const eligible = MOTIVATION_PHRASES.filter(
      (p) =>
        p.category !== 'morning' &&
        p.category !== 'evening' &&
        p.category !== 'relapse' &&
        p.category !== 'postSos' &&
        p.category !== 'zen' &&
        p.category !== 'general' &&
        (p.minDay === undefined || smokeFreeDays >= p.minDay) &&
        (p.maxDay === undefined || smokeFreeDays < p.maxDay),
    );
    if (eligible.length > 0) {
      const pool = freshPool(eligible, usedPhraseIds);
      const pick = pickRandom(pool);
      return { id: pick.id, text: pick.text, category: pick.category, isPersonalStat: false };
    }
  }

  // General fallback
  const generalPool = freshPool(
    allowGeneral
      ? MOTIVATION_PHRASES.filter((p) => p.category === 'general')
      : MOTIVATION_PHRASES.filter(
          (p) =>
            p.category !== 'relapse' &&
            p.category !== 'postSos' &&
            p.category !== 'morning' &&
            p.category !== 'evening',
        ),
    usedPhraseIds,
  );
  const pick = pickRandom(generalPool);
  return { id: pick.id, text: pick.text, category: 'general', isPersonalStat: false };
}
