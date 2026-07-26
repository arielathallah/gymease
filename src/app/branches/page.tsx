'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ExternalLink, Dumbbell } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function BranchesPage() {
  const { branches } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="rose">Partner Network</Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
            GymEase Branch Hubs in Indonesia
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Visit any of our 6 active branch locations across Jakarta Barat, Tangerang Selatan, Bekasi, Tangerang, and Depok.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((b) => (
            <Card key={b.id} className="flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image src={b.image_url} alt={b.name} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="rose" className="bg-slate-950/80 backdrop-blur-md border-0 text-white font-bold">
                      CODE: {b.code}
                    </Badge>
                  </div>
                </div>

                <CardBody className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{b.name}</h3>
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {b.address}, {b.city}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="pt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hours: {b.opening_hours} - {b.closing_hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phone: {b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email: {b.email}</span>
                    </div>
                  </div>
                </CardBody>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <a href={b.google_maps_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1">
                  Google Maps <ExternalLink className="w-3 h-3" />
                </a>

                <Link href={`/search?branch=${b.id}`}>
                  <Button size="sm">Browse Gyms</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
