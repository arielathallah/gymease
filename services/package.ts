import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { GymPackage } from '@/types';
import { db } from './db';

export async function listPackages(): Promise<GymPackage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gym_packages')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error listing packages from Supabase:', err);
      return db.packages.get();
    }
  } else {
    return db.packages.get();
  }
}

export async function listPackagesByGymId(gymId: string): Promise<GymPackage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gym_packages')
        .select('*')
        .eq('gym_id', gymId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error listing packages for gym ${gymId} from Supabase:`, err);
      const pkgs = db.packages.get();
      return pkgs.filter(p => p.gym_id === gymId);
    }
  } else {
    const pkgs = db.packages.get();
    return pkgs.filter(p => p.gym_id === gymId);
  }
}

export async function createPackage(
  pkgData: Omit<GymPackage, 'id' | 'created_at'>
): Promise<GymPackage> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gym_packages')
        .insert({
          gym_id: pkgData.gym_id,
          name: pkgData.name,
          price: pkgData.price,
          duration: pkgData.duration,
          benefits: pkgData.benefits
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating package in Supabase:', err);
      return createPackageMock(pkgData);
    }
  } else {
    return createPackageMock(pkgData);
  }
}

function createPackageMock(
  pkgData: Omit<GymPackage, 'id' | 'created_at'>
): GymPackage {
  const pkgs = db.packages.get();
  const newPkg: GymPackage = {
    ...pkgData,
    id: `pkg-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  pkgs.push(newPkg);
  db.packages.set(pkgs);
  return newPkg;
}

export async function updatePackage(
  id: string,
  pkgData: Partial<GymPackage>
): Promise<GymPackage | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gym_packages')
        .update({
          name: pkgData.name,
          price: pkgData.price,
          duration: pkgData.duration,
          benefits: pkgData.benefits
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error updating package ${id} in Supabase:`, err);
      return updatePackageMock(id, pkgData);
    }
  } else {
    return updatePackageMock(id, pkgData);
  }
}

function updatePackageMock(
  id: string,
  pkgData: Partial<GymPackage>
): GymPackage | null {
  const pkgs = db.packages.get();
  const idx = pkgs.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const updated: GymPackage = {
    ...pkgs[idx],
    ...pkgData
  };
  pkgs[idx] = updated;
  db.packages.set(pkgs);
  return updated;
}

export async function deletePackage(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('gym_packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting package ${id} from Supabase:`, err);
      return deletePackageMock(id);
    }
  } else {
    return deletePackageMock(id);
  }
}

function deletePackageMock(id: string): boolean {
  const pkgs = db.packages.get();
  const filtered = pkgs.filter(p => p.id !== id);
  if (filtered.length === pkgs.length) return false;
  db.packages.set(filtered);
  return true;
}
