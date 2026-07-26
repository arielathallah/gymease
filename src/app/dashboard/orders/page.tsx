'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';

export default function OrdersPage() {
  const mockOrders = [
    {
      id: 'ord1',
      order_number: 'ORD-2026-9821',
      date: '2026-07-20',
      branch_name: 'GymEase Kemanggisan',
      item_name: 'Optimum Nutrition Gold Standard Whey 2lbs',
      price: 580000,
      status: 'completed',
    },
    {
      id: 'ord2',
      order_number: 'ORD-2026-4412',
      date: '2026-07-15',
      branch_name: 'GymEase BSD',
      item_name: 'GymEase Ergonomic Shaker Bottle 700ml',
      price: 85000,
      status: 'completed',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <Badge variant="rose">User Dashboard</Badge>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            Product Orders History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your supplement purchases and gym accessories orders.
          </p>
        </div>

        <div className="space-y-4">
          {mockOrders.map((ord) => (
            <Card key={ord.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="rose">{ord.order_number}</Badge>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ord.item_name}</h4>
                <p className="text-slate-400">Pickup Branch: {ord.branch_name} | Date: {ord.date}</p>
              </div>

              <div className="text-right font-black text-base text-rose-600 dark:text-rose-400">
                {formatRupiah(ord.price)}
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
