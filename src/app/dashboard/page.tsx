'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, QrCode, Heart, ShoppingBag, Bell, ShieldCheck, ArrowRight, MapPin, Clock, Download } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { QRModal } from '@/components/common/QRModal';
import { Booking } from '@/types';

export default function UserDashboardPage() {
  const { currentUser, bookings, wishlistGymIds, wishlistProductIds } = useAppStore();
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="rose">User Dashboard</Badge>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Welcome Back, {currentUser?.name || 'Budi Santoso'} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your gym passes, QR tickets, apparel rentals, and wishlists.
            </p>
          </div>

          <Link href="/booking">
            <Button size="md" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Book New Pass
            </Button>
          </Link>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto">
          <Link href="/dashboard" className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white shrink-0">
            Overview
          </Link>
          <Link href="/dashboard/bookings" className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 shrink-0">
            Bookings & QR Tickets ({bookings.length})
          </Link>
          <Link href="/dashboard/orders" className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 shrink-0">
            Orders History
          </Link>
          <Link href="/dashboard/wishlist" className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 shrink-0">
            Wishlist ({wishlistGymIds.length + wishlistProductIds.length})
          </Link>
          <Link href="/dashboard/settings" className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 shrink-0">
            Profile Settings
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Upcoming Passes</span>
              <Calendar className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{activeBookings.length}</div>
            <span className="text-[11px] text-emerald-500 font-semibold">Ready for reception scan</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total Booked</span>
              <QrCode className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{bookings.length}</div>
            <span className="text-[11px] text-slate-400">All-time passes</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Wishlist Items</span>
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{wishlistGymIds.length + wishlistProductIds.length}</div>
            <span className="text-[11px] text-slate-400">Saved gyms & products</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Rental Clothes Saved</span>
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">100%</div>
            <span className="text-[11px] text-slate-400">Zero gym bag carried</span>
          </Card>
        </div>

        {/* Upcoming Bookings Section */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Gym Passes & QR Tickets</h3>
            <Link href="/dashboard/bookings" className="text-xs font-bold text-rose-500 hover:underline">
              View All History →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((b) => (
              <Card key={b.id} className="p-6 border-l-4 border-l-rose-600 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="rose">CODE: {b.booking_code}</Badge>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{b.gym_name}</h4>
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5" /> {b.branch_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block">Date & Slot</span>
                    <span className="font-bold text-slate-900 dark:text-white">{b.booking_date} @ {b.booking_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Rental Apparel</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {b.rentals.clothesSelected ? `Clothes Size ${b.rentals.clothesSize}` : 'None'}
                      {b.rentals.towelSelected ? ' + Towel' : ''}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                    {formatRupiah(b.grand_total)}
                  </span>
                  <Button
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => setSelectedBookingForQR(b)}
                  >
                    <QrCode className="w-4 h-4" /> View QR Pass
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <QRModal
        isOpen={!!selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
        booking={selectedBookingForQR}
      />

      <Footer />
    </div>
  );
}
