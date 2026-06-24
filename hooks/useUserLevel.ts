import { useUserStore } from '@/store/userStore';

export type UserLevel = 1 | 2 | 3 | 4 | 5;

export interface UserLevelInfo {
  level: UserLevel;
  label: string;
  emoji: string;
  nextLevelDays: number | null;
}

const LEVELS: Array<{ minDays: number; label: string; emoji: string }> = [
  { minDays: 0,   label: 'Débutant',   emoji: '🌱' },
  { minDays: 7,   label: 'Combattant', emoji: '⚔️' },
  { minDays: 30,  label: 'Résilient',  emoji: '🛡️' },
  { minDays: 90,  label: 'Champion',   emoji: '🏅' },
  { minDays: 180, label: 'Légende',    emoji: '👑' },
];

export function computeUserLevel(smokeFreeDays: number): UserLevelInfo {
  let levelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (smokeFreeDays >= LEVELS[i].minDays) {
      levelIndex = i;
      break;
    }
  }
  const { label, emoji } = LEVELS[levelIndex];
  const level = (levelIndex + 1) as UserLevel;
  const nextLevel = LEVELS[levelIndex + 1];
  const nextLevelDays = nextLevel ? nextLevel.minDays - smokeFreeDays : null;

  return { level, label, emoji, nextLevelDays };
}

export function useUserLevel(): UserLevelInfo {
  const lastCigaretteAt = useUserStore((state) => state.profile?.lastCigaretteAt);

  if (!lastCigaretteAt) {
    return { level: 1, label: 'Débutant', emoji: '🌱', nextLevelDays: 7 };
  }

  const smokeFreeDays = Math.floor(
    (Date.now() - new Date(lastCigaretteAt).getTime()) / (24 * 60 * 60 * 1000),
  );

  return computeUserLevel(smokeFreeDays);
}
