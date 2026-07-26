'use client';

import React from 'react';
import { Users, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminCustomersPage() {
  const customers = [
    { id: 'u1', name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '+62 812-9988-7766', verified: true, totalBookings: 8 },
    { id: 'u2', name: 'Siti Rahmawati', email: 'siti.rahma@gmail.com', phone: '+62 813-4455-6677', verified: true, totalBookings: 14 },
    { id: 'u3', name: 'Reza Pratama', email: 'reza.p@gmail.com', phone: '+62 815-1122-3344', verified: true, totalBookings: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <Badge variant="rose">Customer Database</Badge>
        <h1 className="text-2xl font-black text-white mt-1">Registered Users & Customers</h1>
        <p className="text-xs text-slate-400">View user verification status and pass activity.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase font-bold">
              <tr>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Total Passes Booked</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">{c.name}</td>
                  <td className="p-3.5 text-slate-400">{c.email}</td>
                  <td className="p-3.5 text-slate-400">{c.phone}</td>
                  <td className="p-3.5 font-bold text-rose-400">{c.totalBookings} passes</td>
                  <td className="p-3.5">
                    <Badge variant="emerald">VERIFIED</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
