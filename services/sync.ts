import type { UserProfile } from '@/services/calculations';
import { supabase } from '@/services/supabase';
import type { RewardGoal } from '@/store/userStore';
import type { JournalEntry } from '@/services/calculations';

// ─── Types mirroring DB schema ────────────────────────────────────────────────

export interface RemoteProfile {
  id: string;
  last_cigarette_at: string | null;
  cigarettes_per_day: number | null;
  pack_price: number | null;
  product_type: string | null;
  language: string | null;
  currency: string | null;
  theme: string | null;
  updated_at: string;
}

export interface RemoteProgress {
  id: string;
  celebrated_milestones: string[];
  cravings_handled: number;
  app_open_streak: number;
  last_app_open_date: string | null;
  zen_sessions_completed: number;
  updated_at: string;
}

export interface RemoteJournalEntry {
  id: string;
  user_id: string;
  date: string;
  mood: number | null;
  craving: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Push helpers ─────────────────────────────────────────────────────────────

export async function pushProfile(userId: string, profile: UserProfile): Promise<void> {
  await supabase.from('profiles').upsert({
    id: userId,
    last_cigarette_at: profile.lastCigaretteAt ?? null,
    cigarettes_per_day: profile.cigarettesPerDay ?? null,
    pack_price: profile.packPrice ?? null,
    product_type: profile.productType ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
}

export async function pushUserPrefs(
  userId: string,
  prefs: { language: string; currency: string; theme: string },
): Promise<void> {
  await supabase.from('profiles').upsert({
    id: userId,
    language: prefs.language,
    currency: prefs.currency,
    theme: prefs.theme,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
}

export async function pushProgress(
  userId: string,
  data: {
    celebratedMilestones: string[];
    cravingsHandled: number;
    appOpenStreak: number;
    lastAppOpenDate: string | null;
    zenSessionsCompleted: number;
  },
): Promise<void> {
  await supabase.from('user_progress').upsert({
    id: userId,
    celebrated_milestones: data.celebratedMilestones,
    cravings_handled: data.cravingsHandled,
    app_open_streak: data.appOpenStreak,
    last_app_open_date: data.lastAppOpenDate,
    zen_sessions_completed: data.zenSessionsCompleted,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
}

export async function pushJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
  await supabase.from('journal_entries').upsert({
    user_id: userId,
    date: entry.date,
    mood: entry.mood ?? null,
    craving: entry.craving ?? null,
    note: entry.note ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,date' });
}

export async function pushRewardGoals(userId: string, goals: RewardGoal[]): Promise<void> {
  if (!goals.length) return;
  await supabase.from('reward_goals').upsert(
    goals.map((g) => ({
      id: g.id,
      user_id: userId,
      label: g.label,
      amount: g.amount,
      created_at: g.createdAt,
    })),
    { onConflict: 'id' },
  );
}

// ─── Pull helpers ─────────────────────────────────────────────────────────────

export async function pullProfile(userId: string): Promise<RemoteProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data ?? null;
}

export async function pullProgress(userId: string): Promise<RemoteProgress | null> {
  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('id', userId)
    .single();
  return data ?? null;
}

export async function pullJournalEntries(userId: string): Promise<RemoteJournalEntry[]> {
  const { data } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return data ?? [];
}

export async function pullRewardGoals(userId: string): Promise<RewardGoal[]> {
  const { data } = await supabase
    .from('reward_goals')
    .select('*')
    .eq('user_id', userId);
  if (!data) return [];
  return data.map((r) => ({
    id: r.id,
    label: r.label,
    amount: r.amount,
    createdAt: r.created_at,
  }));
}

// ─── Full sync (pull remote → merge with local) ───────────────────────────────

export async function pullAndMerge(userId: string): Promise<{
  profile: RemoteProfile | null;
  progress: RemoteProgress | null;
  journal: RemoteJournalEntry[];
  rewardGoals: RewardGoal[];
}> {
  const [profile, progress, journal, rewardGoals] = await Promise.all([
    pullProfile(userId),
    pullProgress(userId),
    pullJournalEntries(userId),
    pullRewardGoals(userId),
  ]);
  return { profile, progress, journal, rewardGoals };
}

// ─── Full push (local → Supabase) ────────────────────────────────────────────

export async function pushAll(
  userId: string,
  opts: {
    profile: UserProfile | null;
    prefs: { language: string; currency: string; theme: string };
    celebrated: string[];
    cravingsHandled: number;
    appOpenStreak: number;
    lastAppOpenDate: string | null;
    zenSessions: number;
    journalEntries: JournalEntry[];
    rewardGoals: RewardGoal[];
  },
): Promise<void> {
  const tasks: Promise<void>[] = [];

  if (opts.profile) tasks.push(pushProfile(userId, opts.profile));
  tasks.push(pushUserPrefs(userId, opts.prefs));
  tasks.push(
    pushProgress(userId, {
      celebratedMilestones: opts.celebrated,
      cravingsHandled: opts.cravingsHandled,
      appOpenStreak: opts.appOpenStreak,
      lastAppOpenDate: opts.lastAppOpenDate,
      zenSessionsCompleted: opts.zenSessions,
    }),
  );
  for (const entry of opts.journalEntries) {
    tasks.push(pushJournalEntry(userId, entry));
  }
  if (opts.rewardGoals.length) tasks.push(pushRewardGoals(userId, opts.rewardGoals));

  await Promise.allSettled(tasks);
}
