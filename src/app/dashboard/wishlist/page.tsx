'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { gyms, products, wishlistGymIds, wishlistProductIds, toggleWishlistGym, toggleWishlistProduct } = useAppStore();

  const favGyms = gyms.filter((g) => wishlistGymIds.includes(g.id));
  const favProducts = products.filter((p) => wishlistProductIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <Badge variant="rose">User Dashboard</Badge>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            Saved Wishlist Items
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Favorite partner gyms and fitness products saved for quick booking.
          </p>
        </div>

        {/* Favorite Gyms */}
        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Saved Partner Gyms ({favGyms.length})</h3>
          {favGyms.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No favorite gyms saved yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favGyms.map((gym) => (
                <Card key={gym.id} className="p-4 space-y-3">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900">
                    <Image src={gym.main_image} alt={gym.name} fill className="object-cover" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{gym.name}</h4>
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {gym.branch_name}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="danger" size="sm" onClick={() => toggleWishlistGym(gym.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                    <Link href={`/booking?gymId=${gym.id}`}>
                      <Button size="sm">Book Pass</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
