create table if not exists public.user_economy (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_economy enable row level security;

create policy "read own economy" on public.user_economy
  for select using (auth.uid() = user_id);

create policy "insert own economy" on public.user_economy
  for insert with check (auth.uid() = user_id);

create policy "update own economy" on public.user_economy
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
