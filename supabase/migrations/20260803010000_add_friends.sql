create table if not exists public.cardix_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 18),
  friend_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  updated_at timestamptz not null default now()
);

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

create unique index if not exists friend_requests_sender_receiver_key
  on public.friend_requests (sender_id, receiver_id);

alter table public.cardix_profiles enable row level security;
alter table public.friend_requests enable row level security;

create policy "participants read requests" on public.friend_requests
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "sender creates request" on public.friend_requests
  for insert with check (auth.uid() = sender_id and sender_id <> receiver_id and status = 'pending');
create policy "receiver accepts request" on public.friend_requests
  for update using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id and status = 'accepted');
create policy "participants delete request" on public.friend_requests
  for delete using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "read own or connected profiles" on public.cardix_profiles
  for select using (
    auth.uid() = user_id or exists (
      select 1 from public.friend_requests request
      where (request.sender_id = auth.uid() and request.receiver_id = cardix_profiles.user_id)
         or (request.receiver_id = auth.uid() and request.sender_id = cardix_profiles.user_id)
    )
  );
create policy "insert own profile" on public.cardix_profiles
  for insert with check (auth.uid() = user_id);
create policy "update own profile" on public.cardix_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.send_cardix_friend_request(target_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
  existing_status text;
begin
  select user_id into target_id from public.cardix_profiles
    where friend_code = upper(trim(target_code));
  if target_id is null then return 'not_found'; end if;
  if target_id = auth.uid() then return 'self'; end if;

  select status into existing_status from public.friend_requests
    where (sender_id = auth.uid() and receiver_id = target_id)
       or (sender_id = target_id and receiver_id = auth.uid())
    limit 1;
  if existing_status = 'accepted' then return 'already_friends'; end if;
  if existing_status = 'pending' then return 'pending'; end if;

  insert into public.friend_requests (sender_id, receiver_id)
    values (auth.uid(), target_id);
  return 'sent';
end;
$$;

revoke all on function public.send_cardix_friend_request(text) from public;
grant execute on function public.send_cardix_friend_request(text) to authenticated;
grant select, insert, update on public.cardix_profiles to authenticated;
grant select, insert, update, delete on public.friend_requests to authenticated;
