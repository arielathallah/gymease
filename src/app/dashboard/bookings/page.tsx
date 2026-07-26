'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, QrCode, MapPin, Download, Shirt } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { QRModal } from '@/components/common/QRModal';
import { Booking } from '@/types';

export default function UserBookingsPage() {
  const { bookings } = useAppStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="rose">User Dashboard</Badge>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              My Bookings & QR Tickets History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              View active QR tickets, upcoming schedule, and download past invoices.
            </p>
          </div>
          <Link href="/booking">
            <Button size="md">+ New Booking</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="rose">CODE: {b.booking_code}</Badge>
                  <span className="text-xs font-bold text-emerald-500">{b.status.toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{b.gym_name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {b.branch_name}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-500" /> {b.booking_date} @ {b.booking_time}</span>
                  <span className="flex items-center gap-1"><Shirt className="w-3.5 h-3.5 text-rose-500" /> {b.rentals.clothesSelected ? `Clothes ${b.rentals.clothesSize}` : 'No Clothes'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Grand Total</span>
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">{formatRupiah(b.grand_total)}</span>
                </div>
                <Button size="sm" onClick={() => setSelectedBooking(b)} className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4" /> Open QR Pass
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <QRModal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} booking={selectedBooking} />

      <Footer />
    </div>
  );
}
