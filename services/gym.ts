import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Gym } from '@/types';
import { db } from './db';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function listGyms(): Promise<Gym[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: gymsData, error } = await supabase
        .from('gyms')
        .select(`
          *,
          gym_images (image_url)
        `);

      if (error) throw error;

      return (gymsData || []).map((gym: any) => ({
        ...gym,
        gallery: gym.gym_images?.map((g: any) => g.image_url) || []
      }));
    } catch (err) {
      console.error('Error fetching gyms from Supabase:', err);
      // Fallback to local storage on error
      return db.gyms.get();
    }
  } else {
    return db.gyms.get();
  }
}

export async function getGymById(id: string): Promise<Gym | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: gym, error } = await supabase
        .from('gyms')
        .select(`
          *,
          gym_images (image_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!gym) return null;

      return {
        ...gym,
        gallery: gym.gym_images?.map((g: any) => g.image_url) || []
      };
    } catch (err) {
      console.error(`Error fetching gym ${id} from Supabase:`, err);
      const gyms = db.gyms.get();
      return gyms.find(g => g.id === id) || null;
    }
  } else {
    const gyms = db.gyms.get();
    return gyms.find(g => g.id === id) || null;
  }
}

export async function createGym(
  gymData: Omit<Gym, 'id' | 'created_at'>,
  galleryImages: string[]
): Promise<Gym> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: gym, error } = await supabase
        .from('gyms')
        .insert({
          name: gymData.name,
          description: gymData.description,
          address: gymData.address,
          latitude: gymData.latitude,
          longitude: gymData.longitude,
          operating_hours: gymData.operating_hours,
          facilities: gymData.facilities,
          status: gymData.status
        })
        .select()
        .single();

      if (error) throw error;

      if (galleryImages && galleryImages.length > 0) {
        const galleryInserts = galleryImages.map(url => ({
          gym_id: gym.id,
          image_url: url
        }));
        const { error: galleryError } = await supabase
          .from('gym_images')
          .insert(galleryInserts);

        if (galleryError) throw galleryError;
      }

      return {
        ...gym,
        gallery: galleryImages
      };
    } catch (err) {
      console.error('Error creating gym in Supabase:', err);
      return createGymMock(gymData, galleryImages);
    }
  } else {
    return createGymMock(gymData, galleryImages);
  }
}

function createGymMock(
  gymData: Omit<Gym, 'id' | 'created_at'>,
  galleryImages: string[]
): Gym {
  const gyms = db.gyms.get();
  const newGym: Gym = {
    ...gymData,
    id: `gym-${Date.now()}`,
    created_at: new Date().toISOString(),
    gallery: galleryImages
  };
  gyms.push(newGym);
  db.gyms.set(gyms);
  return newGym;
}

export async function updateGym(
  id: string,
  gymData: Partial<Gym>,
  galleryImages?: string[]
): Promise<Gym | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: gym, error } = await supabase
        .from('gyms')
        .update({
          name: gymData.name,
          description: gymData.description,
          address: gymData.address,
          latitude: gymData.latitude,
          longitude: gymData.longitude,
          operating_hours: gymData.operating_hours,
          facilities: gymData.facilities,
          status: gymData.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!gym) return null;

      if (galleryImages) {
        // Delete old gallery items
        await supabase.from('gym_images').delete().eq('gym_id', id);

        // Insert new ones
        if (galleryImages.length > 0) {
          const galleryInserts = galleryImages.map(url => ({
            gym_id: id,
            image_url: url
          }));
          await supabase.from('gym_images').insert(galleryInserts);
        }
      }

      return {
        ...gym,
        gallery: galleryImages || []
      };
    } catch (err) {
      console.error(`Error updating gym ${id} in Supabase:`, err);
      return updateGymMock(id, gymData, galleryImages);
    }
  } else {
    return updateGymMock(id, gymData, galleryImages);
  }
}

function updateGymMock(
  id: string,
  gymData: Partial<Gym>,
  galleryImages?: string[]
): Gym | null {
  const gyms = db.gyms.get();
  const index = gyms.findIndex(g => g.id === id);
  if (index === -1) return null;

  const updatedGym: Gym = {
    ...gyms[index],
    ...gymData,
    gallery: galleryImages !== undefined ? galleryImages : gyms[index].gallery
  };

  gyms[index] = updatedGym;
  db.gyms.set(gyms);
  return updatedGym;
}

export async function deleteGym(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('gyms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting gym ${id} from Supabase:`, err);
      return deleteGymMock(id);
    }
  } else {
    return deleteGymMock(id);
  }
}

function deleteGymMock(id: string): boolean {
  const gyms = db.gyms.get();
  const filtered = gyms.filter(g => g.id !== id);
  if (filtered.length === gyms.length) return false;
  db.gyms.set(filtered);

  // Also clean up packages associated with this gym
  const packages = db.packages.get();
  const filteredPkgs = packages.filter(p => p.gym_id !== id);
  db.packages.set(filteredPkgs);

  return true;
}

// Helper to upload files to Supabase Storage
export async function uploadGymImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gyms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gym-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gym-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading image to Supabase Storage:', err);
      return fileToDataUrl(file);
    }
  } else {
    return fileToDataUrl(file);
  }
}
