import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Notification } from '@/types';
import { db } from './db';

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function listNotificationsByUserId(userId: string): Promise<Notification[]> {
  const notifs = db.notifications.get();
  const localMatches = notifs.filter(n => n.user_id === userId).reverse();

  if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || localMatches;
    } catch (err) {
      console.error(`Error listing notifications for user ${userId} from Supabase:`, err);
      return localMatches;
    }
  }

  return localMatches;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error marking notification ${id} as read:`, err);
      return markNotificationAsReadMock(id);
    }
  } else {
    return markNotificationAsReadMock(id);
  }
}

function markNotificationAsReadMock(id: string): boolean {
  const notifs = db.notifications.get();
  const idx = notifs.findIndex(n => n.id === id);
  if (idx === -1) return false;

  notifs[idx].is_read = true;
  db.notifications.set(notifs);
  return true;
}

export async function createNotification(
  notifData: Omit<Notification, 'id' | 'created_at' | 'is_read'>
): Promise<Notification> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notifData.user_id,
          title: notifData.title,
          message: notifData.message,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating notification in Supabase:', err);
      return createNotificationMock(notifData);
    }
  } else {
    return createNotificationMock(notifData);
  }
}

function createNotificationMock(
  notifData: Omit<Notification, 'id' | 'created_at' | 'is_read'>
): Notification {
  const notifs = db.notifications.get();
  const newNotif: Notification = {
    ...notifData,
    id: `notif-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString()
  };
  notifs.push(newNotif);
  db.notifications.set(notifs);
  return newNotif;
}
