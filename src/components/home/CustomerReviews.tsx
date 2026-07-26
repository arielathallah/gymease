'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '../ui/Card';

export const CustomerReviews: React.FC = () => {
  const { reviews } = useAppStore();

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-3 py-1 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            What GymEase Members Say
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Hear from professionals & fitness enthusiasts across Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <Card key={rev.id} className="relative p-6 flex flex-col justify-between">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-rose-500/20" />
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
                  {rev.user_avatar ? (
                    <Image src={rev.user_avatar} alt={rev.user_name} fill className="object-cover" />
                  ) : (
                    rev.user_name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.user_name}</h4>
                  <span className="text-[11px] text-slate-400">{rev.gym_name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
