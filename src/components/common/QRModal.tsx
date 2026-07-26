'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, CheckCircle2, MapPin, Calendar, Clock, Shirt } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Booking } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { exportToPDF } from '@/lib/export-utils';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const handleDownloadInvoice = () => {
    const headers = ['Field', 'Details'];
    const rows = [
      ['Booking Code', booking.booking_code],
      ['Customer Name', booking.user_name],
      ['Branch Name', booking.branch_name],
      ['Gym Partner', booking.gym_name],
      ['Package', booking.package_name],
      ['Booking Date & Time', `${booking.booking_date} at ${booking.booking_time}`],
      ['Rental Clothes Size', booking.rentals.clothesSelected ? `${booking.rentals.clothesSize} (${booking.rentals.clothesQty}x)` : 'None'],
      ['Rental Towel', booking.rentals.towelSelected ? `Yes (${booking.rentals.towelQty}x)` : 'None'],
      ['Grand Total', formatRupiah(booking.grand_total)],
      ['Status', booking.status.toUpperCase()],
    ];

    exportToPDF(`Invoice_${booking.booking_code}`, `GymEase Invoice - ${booking.booking_code}`, headers, rows);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Booking Pass & QR Ticket">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-rose-300 shadow-md flex flex-col items-center">
          <QRCodeSVG value={booking.booking_code} size={180} level="H" includeMargin={true} />
          <span className="mt-2 text-xs font-mono font-bold text-slate-700 tracking-wider">
            {booking.booking_code}
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4" />
          Confirmed Pass - Ready for Reception Check-in
        </div>

        {/* Details Grid */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-left text-xs space-y-2 text-slate-700 dark:text-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium">Gym Partner</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {booking.gym_name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Schedule</span>
            <span className="font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {booking.booking_date} @ {booking.booking_time}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Package</span>
            <span className="font-semibold">{booking.package_name}</span>
          </div>

          {/* Rental items indicator */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium">Rental Apparel</span>
            <span className="font-semibold text-rose-500 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" />
              {booking.rentals.clothesSelected ? `Clothes Size ${booking.rentals.clothesSize}` : ''}
              {booking.rentals.towelSelected ? ` + Towel (${booking.rentals.towelQty})` : ''}
              {!booking.rentals.clothesSelected && !booking.rentals.towelSelected && 'None'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white">
            <span>Total Paid</span>
            <span className="text-rose-600 dark:text-rose-400">{formatRupiah(booking.grand_total)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={handleDownloadInvoice} className="w-full flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF Invoice
        </Button>
      </div>
    </Modal>
  );
};
