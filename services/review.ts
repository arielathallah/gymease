import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Review } from '@/types';
import { db } from './db';
import { getCurrentUser } from './user';

export async function listReviewsByGymId(gymId: string): Promise<Review[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((r: any) => ({
        ...r,
        user_name: r.profiles?.full_name || 'GymEase Member',
        user_avatar: r.profiles?.avatar_url || undefined
      }));
    } catch (err) {
      console.error(`Error fetching reviews for gym ${gymId} from Supabase:`, err);
      const reviews = db.reviews.get();
      return reviews.filter(r => r.gym_id === gymId);
    }
  } else {
    const reviews = db.reviews.get();
    return reviews.filter(r => r.gym_id === gymId);
  }
}

export async function createReview(
  reviewData: Omit<Review, 'id' | 'created_at' | 'user_name' | 'user_avatar'>
): Promise<Review> {
  const user = await getCurrentUser();
  const userName = user?.full_name || 'GymEase Member';
  const userAvatar = user?.avatar_url || '';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: reviewData.user_id,
          gym_id: reviewData.gym_id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select()
        .single();
      
      if (error) throw error;

      return {
        ...data,
        user_name: userName,
        user_avatar: userAvatar || undefined
      };
    } catch (err) {
      console.error('Error creating review in Supabase:', err);
      return createReviewMock(reviewData, userName, userAvatar);
    }
  } else {
    return createReviewMock(reviewData, userName, userAvatar);
  }
}

function createReviewMock(
  reviewData: Omit<Review, 'id' | 'created_at' | 'user_name' | 'user_avatar'>,
  userName: string,
  userAvatar: string | null
): Review {
  const reviews = db.reviews.get();
  
  // Enforce unique review constraint per user-gym
  const filtered = reviews.filter(
    r => !(r.user_id === reviewData.user_id && r.gym_id === reviewData.gym_id)
  );

  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
    user_name: userName,
    user_avatar: userAvatar || undefined
  };

  filtered.push(newReview);
  db.reviews.set(filtered);
  return newReview;
}
