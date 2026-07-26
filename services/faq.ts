import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { FAQItem } from '@/types';
import { db } from './db';

export async function listFaqs(): Promise<FAQItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('order_num', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching FAQs from Supabase:', err);
      return db.faqs.get().sort((a, b) => a.order_num - b.order_num);
    }
  } else {
    return db.faqs.get().sort((a, b) => a.order_num - b.order_num);
  }
}
