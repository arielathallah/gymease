import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const PromoBannerSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-y border-rose-900/50 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Special Welcome Voucher
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Get <span className="text-amber-400">20% OFF</span> Your First Gym Booking!
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            Use promo code <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">GYMEASE20</span> at checkout to claim your discount.
          </p>
        </div>

        <Link href="/booking">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-xl">
            Book Gym Pass Now
          </Button>
        </Link>
      </div>
    </section>
  );
};
