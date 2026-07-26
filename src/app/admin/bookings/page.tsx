'use client';

import React, { useState } from 'react';
import { Calendar, ShieldAlert, CheckCircle2, QrCode, MapPin, Search } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { QRModal } from '@/components/common/QRModal';
import { Booking } from '@/types';

export default function AdminBookingsPage() {
  const { currentRole, adminBranchId, branches, bookings, updateBookingStatus } = useAppStore();
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);

  const activeBranch = branches.find((b) => b.id === adminBranchId);

  // BRANCH ISOLATION FILTERING:
  // If Branch Admin, show ONLY bookings matching branch_id!
  // If Super Admin, show ALL bookings!
  const isBranchAdmin = currentRole === 'branch_admin';
  const displayedBookings = isBranchAdmin
    ? bookings.filter((b) => b.branch_id === adminBranchId)
    : bookings;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant={isBranchAdmin ? 'amber' : 'rose'}>
            {isBranchAdmin ? `RLS SCOPED: ${activeBranch?.name}` : 'SUPER ADMIN GLOBAL'}
          </Badge>
          <h1 className="text-2xl font-black text-white mt-1">
            Bookings Management
          </h1>
          <p className="text-xs text-slate-400">
            {isBranchAdmin
              ? `Displaying bookings strictly assigned to ${activeBranch?.name} via Supabase RLS.`
              : 'Viewing all nationwide bookings across all 6 branch hubs.'}
          </p>
        </div>
      </div>

      {/* RLS Security Isolation Banner */}
      {isBranchAdmin && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">Branch Isolation RLS Active:</strong> Bookings for BSD, Grogol, Bekasi, Tangerang, and Depok are completely invisible to Admin {activeBranch?.code}.
            </span>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">
            Booking Records ({displayedBookings.length})
          </h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Gym Partner</th>
                <th className="p-3.5">Date & Slot</th>
                <th className="p-3.5">Apparel Rental</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 italic">
                    No bookings found for this branch.
                  </td>
                </tr>
              ) : (
                displayedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-rose-400">{b.booking_code}</td>
                    <td className="p-3.5 font-semibold text-white">{b.user_name}</td>
                    <td className="p-3.5 text-slate-400">{b.branch_name}</td>
                    <td className="p-3.5 font-semibold">{b.gym_name}</td>
                    <td className="p-3.5 text-slate-400">{b.booking_date} @ {b.booking_time}</td>
                    <td className="p-3.5 text-slate-300">
                      {b.rentals.clothesSelected ? `Clothes Size ${b.rentals.clothesSize}` : 'No Clothes'}
                      {b.rentals.towelSelected ? ' + Towel' : ''}
                    </td>
                    <td className="p-3.5 font-bold text-white">{formatRupiah(b.grand_total)}</td>
                    <td className="p-3.5">
                      <Badge variant={b.status === 'confirmed' ? 'emerald' : 'slate'}>
                        {b.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBookingForQR(b)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                        title="View QR Code Pass"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      {b.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="success"
                          className="text-[10px] px-2 py-1"
                          onClick={() => updateBookingStatus(b.id, 'checked_in')}
                        >
                          Check In
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <QRModal
        isOpen={!!selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
        booking={selectedBookingForQR}
      />
    </div>
  );
}
