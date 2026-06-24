export type ChallengeLevel = 'easy' | 'medium' | 'hard';

export interface WeeklyChallengeTemplate {
  id: string;
  level: ChallengeLevel;
  label: string;
  target: number;
  unit: string;
}

export const weeklyChallenges: WeeklyChallengeTemplate[] = [
  // EASY
  { id: 'wc-01', level: 'easy', label: 'Ouvre Respire 7 jours de suite', target: 7, unit: 'jours' },
  { id: 'wc-02', level: 'easy', label: 'Fais 3 sessions Zone Zen cette semaine', target: 3, unit: 'sessions' },
  { id: 'wc-03', level: 'easy', label: 'Bois 1,5L d\'eau par jour pendant 5 jours', target: 5, unit: 'jours' },
  { id: 'wc-04', level: 'easy', label: 'Calcule ce que tu aurais dépensé cette semaine et note à quoi tu le destines', target: 1, unit: 'note' },
  { id: 'wc-05', level: 'easy', label: 'Ajoute ou mets à jour ton objectif cagnotte', target: 1, unit: 'action' },
  { id: 'wc-06', level: 'easy', label: 'Fais 10 grandes respirations profondes dès que tu te lèves, pendant 5 jours', target: 5, unit: 'jours' },
  // MEDIUM
  { id: 'wc-07', level: 'medium', label: 'Écris 3 entrées dans le Journal', target: 3, unit: 'entrées' },
  { id: 'wc-08', level: 'medium', label: 'Note ton envie (craving) chaque fois qu\'elle arrive pendant 5 jours', target: 5, unit: 'jours' },
  { id: 'wc-09', level: 'medium', label: 'Fais la technique 4-7-8 avant de dormir 4 soirs de suite', target: 4, unit: 'soirs' },
  { id: 'wc-10', level: 'medium', label: 'Fais une session Zen de 5 min après le dîner 3 fois cette semaine', target: 3, unit: 'sessions' },
  { id: 'wc-11', level: 'medium', label: 'Marche 20 min dehors 3 fois cette semaine', target: 3, unit: 'sorties' },
  { id: 'wc-12', level: 'medium', label: 'Dors avant minuit 4 nuits de suite', target: 4, unit: 'nuits' },
  { id: 'wc-13', level: 'medium', label: '5 minutes de cohérence cardiaque chaque matin pendant 3 jours', target: 3, unit: 'matins' },
  { id: 'wc-14', level: 'medium', label: 'Identifie ton principal trigger cette semaine et note-le', target: 1, unit: 'note' },
  // HARD
  { id: 'wc-15', level: 'hard', label: 'Utilise le mode SOS si une envie arrive — ne cède pas', target: 1, unit: 'session' },
  { id: 'wc-16', level: 'hard', label: 'Chaque envie cette semaine → attends 3 minutes avant de faire quoi que ce soit', target: 5, unit: 'envies' },
  { id: 'wc-17', level: 'hard', label: 'Écris pourquoi tu as arrêté — relis-le chaque matin pendant 3 jours', target: 3, unit: 'matins' },
  { id: 'wc-18', level: 'hard', label: 'Trouve 1 activité qui remplace la cigarette dans ton moment difficile du jour', target: 1, unit: 'activité' },
  { id: 'wc-19', level: 'hard', label: 'Dis à quelqu\'un dans ta vie que tu as arrêté de fumer', target: 1, unit: 'personne' },
  { id: 'wc-20', level: 'hard', label: 'Passe une soirée sociale sans fumer et note comment tu t\'en es sorti', target: 1, unit: 'soirée' },
];

export function pickWeeklyChallenge(
  userLevel: 1 | 2 | 3 | 4 | 5,
  weekStart: string,
  usedChallengeIds: string[] = [],
): WeeklyChallengeTemplate {
  const level: ChallengeLevel =
    userLevel <= 2 ? 'easy' : userLevel <= 4 ? 'medium' : 'hard';
  const pool = weeklyChallenges.filter((c) => c.level === level);
  const fresh = pool.filter((c) => !usedChallengeIds.includes(c.id));
  const source = fresh.length > 0 ? fresh : pool; // reset if all used

  // Deterministic within the fresh pool: seed from week start
  const seed = new Date(weekStart).getTime();
  return source[seed % source.length] ?? source[0];
}

export function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
