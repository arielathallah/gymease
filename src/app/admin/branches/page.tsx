'use client';

import React from 'react';
import Image from 'next/image';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminBranchesPage() {
  const { branches } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <Badge variant="rose font-bold">Super Admin Hub Manager</Badge>
        <h1 className="text-2xl font-black text-white mt-1">GymEase Branch Hubs</h1>
        <p className="text-xs text-slate-400">All active Indonesian branch hubs overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <Card key={b.id} className="bg-slate-900 border-slate-800 p-5 space-y-3">
            <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-800">
              <Image src={b.image_url} alt={b.name} fill className="object-cover" />
            </div>
            <h3 className="font-bold text-base text-white">{b.name}</h3>
            <p className="text-xs text-slate-400">{b.address}, {b.city}</p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-1">
              <div>Phone: {b.phone}</div>
              <div>Email: {b.email}</div>
              <div>Coordinates: {b.latitude}, {b.longitude}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
