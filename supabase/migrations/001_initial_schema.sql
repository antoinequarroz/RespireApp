-- Enable UUID extension (already available on Supabase)
-- Row Level Security (RLS) is enabled on all tables

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  last_cigarette_at   timestamptz,
  cigarettes_per_day  numeric,
  pack_price          numeric,
  product_type        text,
  language            text default 'fr',
  currency            text default 'EUR',
  theme               text default 'system',
  updated_at          timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── user_progress ───────────────────────────────────────────────────────────
create table if not exists public.user_progress (
  id                      uuid primary key references auth.users(id) on delete cascade,
  celebrated_milestones   text[]  default '{}',
  cravings_handled        integer default 0,
  app_open_streak         integer default 0,
  last_app_open_date      date,
  zen_sessions_completed  integer default 0,
  updated_at              timestamptz default now()
);

alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = id);

create policy "Users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = id);

-- ─── journal_entries ─────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  mood        smallint check (mood between 1 and 5),
  craving     smallint check (craving between 1 and 5),
  note        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, date)
);

alter table public.journal_entries enable row level security;

create policy "Users can read own journal"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- ─── reward_goals ────────────────────────────────────────────────────────────
create table if not exists public.reward_goals (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text not null,
  amount      numeric not null,
  created_at  timestamptz default now()
);

alter table public.reward_goals enable row level security;

create policy "Users can read own reward goals"
  on public.reward_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own reward goals"
  on public.reward_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reward goals"
  on public.reward_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own reward goals"
  on public.reward_goals for delete
  using (auth.uid() = user_id);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger trg_progress_updated_at
  before update on public.user_progress
  for each row execute procedure public.set_updated_at();

create trigger trg_journal_updated_at
  before update on public.journal_entries
  for each row execute procedure public.set_updated_at();
