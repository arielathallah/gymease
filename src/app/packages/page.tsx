'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, Calendar } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';

export default function PackagesPage() {
  const { packages } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="rose">Transparent Passes</Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
            GymEase Pass Packages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Choose single passes or all-inclusive apparel rental passes with zero long-term contract.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`p-6 flex flex-col justify-between relative ${
                pkg.is_popular ? 'border-2 border-rose-500 shadow-2xl scale-[1.02]' : ''
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pkg.description}</p>

                <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                  <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
                    {formatRupiah(pkg.price)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / {pkg.duration_days} Day Pass</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Included Benefits:</span>
                  <ul className="space-y-2">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link href={`/booking?pkgId=${pkg.id}`} className="pt-6">
                <Button size="lg" className="w-full">
                  Book {pkg.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
