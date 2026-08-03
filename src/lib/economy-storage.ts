import { supabase } from './supabase';
import type { EconomyState } from './economy-context';

export async function loadCloudEconomy(userId: string) {
  const { data, error } = await supabase.from('user_economy').select('state').eq('user_id', userId).maybeSingle();
  if (error) return null;
  return data?.state as Partial<EconomyState> | undefined;
}

export async function saveCloudEconomy(userId: string, state: EconomyState) {
  const { error } = await supabase.from('user_economy')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  return !error;
}
