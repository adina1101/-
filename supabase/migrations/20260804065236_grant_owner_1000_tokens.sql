do $$
declare
  owner_id uuid;
  claim_id constant text := 'personal-owner-grant-1000-2026-08-04';
begin
  select id into strict owner_id
  from auth.users
  where md5(lower(email)) = 'f1cb4d8d9d9fe995f884978ee530fab6';

  insert into public.user_economy (user_id, state, updated_at)
  values (
    owner_id,
    jsonb_build_object('tokens', 1240, 'rewardClaims', jsonb_build_array(claim_id)),
    now()
  )
  on conflict (user_id) do update
  set state = case
      when coalesce(public.user_economy.state -> 'rewardClaims', '[]'::jsonb)
        @> jsonb_build_array(claim_id)
        then public.user_economy.state
      else jsonb_set(
        jsonb_set(
          public.user_economy.state,
          '{tokens}',
          to_jsonb(coalesce((public.user_economy.state ->> 'tokens')::integer, 240) + 1000),
          true
        ),
        '{rewardClaims}',
        coalesce(public.user_economy.state -> 'rewardClaims', '[]'::jsonb) || jsonb_build_array(claim_id),
        true
      )
    end,
    updated_at = now();
end $$;
