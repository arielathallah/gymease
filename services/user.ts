import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Profile } from '@/types';

// Browser-safe session helpers
const isBrowser = typeof window !== 'undefined';

export function getMockUser(): Profile | null {
  if (!isBrowser) return null;
  const data = sessionStorage.getItem('gymease_mock_user');
  if (!data) return null;
  try {
    return JSON.parse(data) as Profile;
  } catch (e) {
    return null;
  }
}

export function setMockUser(profile: Profile | null): void {
  if (isBrowser) {
    if (profile) {
      sessionStorage.setItem('gymease_mock_user', JSON.stringify(profile));
    } else {
      sessionStorage.removeItem('gymease_mock_user');
    }
  }
}

export async function getCurrentUser(): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return getMockUser();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // Fallback: create profile if user exists but profile table record failed trigger
        const newProfile: Profile = {
          id: user.id,
          role: (user.user_metadata?.role as any) || 'customer',
          full_name: user.user_metadata?.full_name || 'GymEase User',
          avatar_url: user.user_metadata?.avatar_url || null,
          phone: user.user_metadata?.phone || null,
          created_at: user.created_at
        };
        return newProfile;
      }
      return profile;
    } catch (err) {
      console.error('Error in getCurrentUser:', err);
      return getMockUser();
    }
  } else {
    return getMockUser();
  }
}

export async function getProfile(id: string): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error fetching profile ${id} from Supabase:`, err);
      const mock = getMockUser();
      if (mock && mock.id === id) return mock;
      return null;
    }
  } else {
    const mock = getMockUser();
    if (mock && mock.id === id) return mock;
    return null;
  }
}

export async function updateProfile(
  id: string,
  profileData: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error updating profile ${id} in Supabase:`, err);
      return updateProfileMock(id, profileData);
    }
  } else {
    return updateProfileMock(id, profileData);
  }
}

function updateProfileMock(
  id: string,
  profileData: Partial<Omit<Profile, 'id' | 'created_at'>>
): Profile | null {
  const mock = getMockUser();
  if (mock && mock.id === id) {
    const updated = { ...mock, ...profileData };
    setMockUser(updated);
    return updated;
  }
  return null;
}

export async function listCustomers(): Promise<Profile[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching customers from Supabase:', err);
      return getMockCustomers();
    }
  } else {
    return getMockCustomers();
  }
}

function getMockCustomers(): Profile[] {
  return [
    {
      id: '11111111-1111-4111-8111-111111111111',
      role: 'customer',
      full_name: 'Budi Santoso',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      phone: '081234567890',
      created_at: new Date().toISOString()
    },
    {
      id: 'customer-2',
      role: 'customer',
      full_name: 'Siti Rahma',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      phone: '082198765432',
      created_at: new Date().toISOString()
    },
    {
      id: 'customer-3',
      role: 'customer',
      full_name: 'Dewi Lestari',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',
      phone: '085733445566',
      created_at: new Date().toISOString()
    }
  ];
}

export async function uploadProfileAvatar(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return URL.createObjectURL(file);
    }
  } else {
    return URL.createObjectURL(file);
  }
}
