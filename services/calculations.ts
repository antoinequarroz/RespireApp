import { HEALTH_TIMELINE } from '@/constants/healthTimeline';
import { MILESTONES } from '@/constants/milestones';
import { MONEY_EQUIVALENTS } from '@/constants/moneyEquivalents';

export type AppLanguage = 'fr' | 'en' | 'de';
export type AppTheme = 'light' | 'dark' | 'system';

export interface UserProfile {
  lastCigaretteAt: string;
  cigarettesPerDay: number;
  packPrice: number;
  motivations?: string[];
}

export interface CounterBreakdown {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  craving: number;
  note: string;
}

export interface RewardEquivalent {
  euros: number;
  emoji: string;
  labelFr: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export function msFromTimelineItem(
  item: (typeof HEALTH_TIMELINE)[number] | (typeof MILESTONES)[number],
): number {
  const minutes = 'minutes' in item ? item.minutes ?? 0 : 0;
  const hours = 'hours' in item ? item.hours ?? 0 : 0;
  const days = 'days' in item ? item.days ?? 0 : 0;
  const weeks = 'weeks' in item ? item.weeks ?? 0 : 0;
  const months = 'months' in item ? item.months ?? 0 : 0;
  const years = 'years' in item ? item.years ?? 0 : 0;

  return (
    minutes * MINUTE_MS +
    hours * HOUR_MS +
    days * DAY_MS +
    weeks * 7 * DAY_MS +
    months * 30 * DAY_MS +
    years * 365 * DAY_MS
  );
}

export function getElapsedMs(lastCigaretteAt?: string, now = Date.now()): number {
  if (!lastCigaretteAt) {
    return 0;
  }

  return Math.max(now - new Date(lastCigaretteAt).getTime(), 0);
}

export function getCounterBreakdown(lastCigaretteAt?: string, now = Date.now()): CounterBreakdown {
  const totalMs = getElapsedMs(lastCigaretteAt, now);
  const days = Math.floor(totalMs / DAY_MS);
  const hours = Math.floor((totalMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((totalMs % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((totalMs % MINUTE_MS) / 1000);

  return { totalMs, days, hours, minutes, seconds };
}

export function getAvoidedCigarettes(
  lastCigaretteAt?: string,
  cigarettesPerDay = 0,
  now = Date.now(),
): number {
  if (!lastCigaretteAt || cigarettesPerDay <= 0) {
    return 0;
  }

  const msPerCigarette = DAY_MS / cigarettesPerDay;
  return Math.floor(getElapsedMs(lastCigaretteAt, now) / msPerCigarette);
}

export function getMoneySaved(
  lastCigaretteAt?: string,
  cigarettesPerDay = 0,
  packPrice = 0,
  now = Date.now(),
): number {
  if (cigarettesPerDay <= 0 || packPrice <= 0) {
    return 0;
  }

  return (getAvoidedCigarettes(lastCigaretteAt, cigarettesPerDay, now) / 20) * packPrice;
}

export function pickMoneyEquivalent(moneySaved: number, rotationIndex = 0): RewardEquivalent {
  const unlocked = MONEY_EQUIVALENTS.filter((item) => moneySaved >= item.euros);
  const source = unlocked.length > 0 ? unlocked : MONEY_EQUIVALENTS.slice(0, 3);
  return source[rotationIndex % source.length] ?? MONEY_EQUIVALENTS[0];
}

export function formatCurrency(value: number, locale = 'fr-CH'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function getSavingsSeries(
  profile: UserProfile | null,
  totalDays = 30,
): { x: number; y: number }[] {
  if (!profile) {
    return Array.from({ length: totalDays }, (_, index) => ({ x: index, y: 0 }));
  }

  const pricePerCigarette = profile.packPrice / 20;
  const perDay = profile.cigarettesPerDay * pricePerCigarette;

  return Array.from({ length: totalDays }, (_, index) => ({
    x: index,
    y: Number((perDay * (index + 1)).toFixed(2)),
  }));
}

export function getReachedHealthSteps(elapsedMs: number) {
  return HEALTH_TIMELINE.map((item) => ({
    ...item,
    targetMs: msFromTimelineItem(item),
    reached: elapsedMs >= msFromTimelineItem(item),
  }));
}

export function getMilestonesProgress(elapsedMs: number) {
  const prepared = MILESTONES.map((item) => ({
    ...item,
    targetMs: msFromTimelineItem(item),
    reached: elapsedMs >= msFromTimelineItem(item),
  }));

  const next = prepared.find((item) => !item.reached) ?? prepared[prepared.length - 1];
  const previous = [...prepared].reverse().find((item) => item.reached);
  const start = previous?.targetMs ?? 0;
  const range = Math.max(next.targetMs - start, 1);
  const progress = Math.min(Math.max((elapsedMs - start) / range, 0), 1);

  return { milestones: prepared, next, progress };
}

export function buildMilestoneDate(lastCigaretteAt: string, targetMs: number): Date {
  return new Date(new Date(lastCigaretteAt).getTime() + targetMs);
}

export function getThirtyDayTrend(entries: JournalEntry[]) {
  const latest = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  const averageMood =
    latest.length === 0 ? 0 : latest.reduce((sum, item) => sum + item.mood, 0) / latest.length;
  const averageCraving =
    latest.length === 0 ? 0 : latest.reduce((sum, item) => sum + item.craving, 0) / latest.length;

  return {
    entries: latest,
    averageMood: Number(averageMood.toFixed(1)),
    averageCraving: Number(averageCraving.toFixed(1)),
  };
}
