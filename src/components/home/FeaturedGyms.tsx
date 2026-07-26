'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const FeaturedGyms: React.FC = () => {
  const { gyms, wishlistGymIds, toggleWishlistGym } = useAppStore();

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <Badge variant="rose" className="mb-2">Featured Partner Gyms</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Rated Gyms Across Indonesia
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Explore state-of-the-art gyms equipped with clothes rental & towel service.
            </p>
          </div>
          <Link href="/search" className="mt-4 md:mt-0 inline-flex items-center gap-1 text-rose-600 font-bold hover:underline text-sm">
            View All Gyms <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gym Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gyms.slice(0, 3).map((gym) => {
            const isFav = wishlistGymIds.includes(gym.id);
            return (
              <Card key={gym.id} className="group flex flex-col justify-between">
                <div>
                  {/* Image Container */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                    <Image
                      src={gym.main_image}
                      alt={gym.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() => toggleWishlistGym(gym.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          isFav ? 'bg-rose-600 text-white' : 'bg-slate-900/60 text-white hover:bg-rose-600'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                      <Badge variant="emerald" className="bg-slate-950/80 text-white border-0 backdrop-blur-md">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                        {gym.rating} ({gym.total_reviews})
                      </Badge>
                    </div>
                  </div>

                  {/* Body Details */}
                  <CardBody className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {gym.branch_name}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {gym.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {gym.description}
                    </p>

                    {/* Facilities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {gym.facilities.slice(0, 4).map((facility, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          {facility}
                        </span>
                      ))}
                      {gym.facilities.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-400">
                          +{gym.facilities.length - 4}
                        </span>
                      )}
                    </div>
                  </CardBody>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {gym.opening_hours} - {gym.closing_hours}
                  </div>

                  <Link href={`/gyms/${gym.id}`}>
                    <Button size="sm" variant="primary">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
