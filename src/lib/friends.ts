import { supabase } from './supabase';

interface ProfileRow { user_id: string; nickname: string; friend_code: string }
interface RequestRow {
  id: string; sender_id: string; receiver_id: string; status: 'pending' | 'accepted';
}

export interface FriendConnection {
  requestId: string;
  userId: string;
  nickname: string;
  code: string;
  direction: 'incoming' | 'outgoing' | 'friend';
}

export interface FriendsSnapshot {
  ownCode: string;
  friends: FriendConnection[];
  requests: FriendConnection[];
}

export async function loadFriends(userId: string, nickname: string): Promise<FriendsSnapshot> {
  const { data: own, error: profileError } = await supabase.from('cardix_profiles')
    .upsert({ user_id: userId, nickname, updated_at: new Date().toISOString() })
    .select('user_id,nickname,friend_code').single();
  if (profileError) throw profileError;

  const { data, error } = await supabase.from('friend_requests')
    .select('id,sender_id,receiver_id,status').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  if (error) throw error;
  const rows = (data ?? []) as RequestRow[];
  const ids = [...new Set(rows.map((row) => row.sender_id === userId ? row.receiver_id : row.sender_id))];
  if (ids.length === 0) return { ownCode: (own as ProfileRow).friend_code, friends: [], requests: [] };

  const { data: profiles, error: profilesError } = await supabase.from('cardix_profiles')
    .select('user_id,nickname,friend_code').in('user_id', ids);
  if (profilesError) throw profilesError;
  const profileMap = new Map(((profiles ?? []) as ProfileRow[]).map((profile) => [profile.user_id, profile]));
  const connections = rows.flatMap((row): FriendConnection[] => {
    const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
    const profile = profileMap.get(otherId);
    if (!profile) return [];
    const direction = row.status === 'accepted' ? 'friend'
      : row.receiver_id === userId ? 'incoming' : 'outgoing';
    return [{ requestId: row.id, userId: otherId, nickname: profile.nickname, code: profile.friend_code, direction }];
  });
  return {
    ownCode: (own as ProfileRow).friend_code,
    friends: connections.filter((item) => item.direction === 'friend'),
    requests: connections.filter((item) => item.direction !== 'friend'),
  };
}

export async function sendFriendRequest(code: string) {
  const { data, error } = await supabase.rpc('send_cardix_friend_request', { target_code: code });
  if (error) throw error;
  return String(data) as 'sent' | 'not_found' | 'self' | 'pending' | 'already_friends';
}

export async function acceptFriendRequest(id: string) {
  const { error } = await supabase.from('friend_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function removeFriendConnection(id: string) {
  const { error } = await supabase.from('friend_requests').delete().eq('id', id);
  if (error) throw error;
}
