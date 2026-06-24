import AsyncStorage from '@react-native-async-storage/async-storage';

export type MotivationTrigger = 'streak' | 'milestone' | 'relapse' | 'sos';

export interface MotivationContent {
  id: string;
  phrase: string;
  context: string;
}

const MOTIVATION_LAST_SHOWN_KEY = 'respire-last-motivation-shown';
const MOTIVATION_SAVED_KEY = 'respire-saved-motivations';

const PHRASES: Record<MotivationTrigger, MotivationContent[]> = {
  streak: [
    { id: 'streak-1', phrase: "L'envie dure 3 minutes. Toi, tu dures plus que ça.", context: 'Respire · Streak actif' },
    { id: 'streak-2', phrase: "T’as tenu hier. T’as tenu aujourd’hui. C’est pas rien.", context: 'Respire · Streak actif' },
    { id: 'streak-3', phrase: 'Chaque matin sans cigarette, ton corps dit merci en silence.', context: 'Respire · Streak actif' },
    { id: 'streak-4', phrase: 'Le plus dur, c’était le premier jour. T’es déjà loin devant.', context: 'Respire · Streak actif' },
  ],
  milestone: [
    { id: 'milestone-1', phrase: 'Chaque jour ajouté, c’est une décision prise 24 fois de suite.', context: 'Respire · Nouveau cap' },
    { id: 'milestone-2', phrase: 'T’as transformé une habitude en choix. Pas tout le monde en est capable.', context: 'Respire · Nouveau cap' },
    { id: 'milestone-3', phrase: 'Un mois. Tes poumons ont déjà oublié la moitié du tabac.', context: 'Respire · Nouveau cap' },
  ],
  relapse: [
    { id: 'relapse-1', phrase: 'La rechute n’efface rien. Elle reporte juste le succès.', context: 'Respire · Nouveau départ' },
    { id: 'relapse-2', phrase: 'Repartir, c’est déjà plus fort que ne jamais avoir essayé.', context: 'Respire · Nouveau départ' },
    { id: 'relapse-3', phrase: 'Aujourd’hui, t’as recommencé. C’est ce qui compte.', context: 'Respire · Nouveau départ' },
  ],
  sos: [
    { id: 'sos-1', phrase: 'Tes poumons récupèrent en ce moment même.', context: 'Respire · Après une envie forte' },
    { id: 'sos-2', phrase: '3 minutes. T’as tenu les 3 minutes. Bravo.', context: 'Respire · Après une envie forte' },
    { id: 'sos-3', phrase: 'L’envie est passée. Elle passe toujours.', context: 'Respire · Après une envie forte' },
  ],
};

function getTodayKey() {
  return new Date().toDateString();
}

export function getMotivationPhrase(trigger: MotivationTrigger, streak = 0): MotivationContent {
  const source = PHRASES[trigger];
  const index = Math.abs(streak) % source.length;
  return source[index] ?? source[0];
}

export async function canShowDailyMotivation() {
  const lastShown = await AsyncStorage.getItem(MOTIVATION_LAST_SHOWN_KEY);
  return lastShown !== getTodayKey();
}

export async function markMotivationShownToday() {
  await AsyncStorage.setItem(MOTIVATION_LAST_SHOWN_KEY, getTodayKey());
}

export async function saveMotivationPhrase(content: MotivationContent) {
  const current = await AsyncStorage.getItem(MOTIVATION_SAVED_KEY);
  const parsed: MotivationContent[] = current ? JSON.parse(current) : [];
  if (parsed.some((item) => item.id === content.id)) {
    return;
  }
  await AsyncStorage.setItem(MOTIVATION_SAVED_KEY, JSON.stringify([...parsed, content]));
}
