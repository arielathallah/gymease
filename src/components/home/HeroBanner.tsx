'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Dumbbell, Sparkles, ArrowRight, ShieldCheck, Shirt } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '../ui/Button';

export const HeroBanner: React.FC = () => {
  const { gyms, branches } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  // Filter gym suggestions for autocomplete
  const suggestions = gyms.filter((g) => {
    const matchesQuery = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.facilities.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'All' || g.branch_name?.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesQuery && matchesCity;
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 border-b border-slate-800">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-400 text-xs font-bold tracking-wide uppercase animate-pulse">
            <Sparkles className="w-4 h-4" />
            Indonesia&apos;s #1 All-Inclusive Gym Marketplace
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Workout Without <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400">
              Bringing Anything.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Book gym passes across Jakarta, BSD, Bekasi, Tangerang & Depok. Complete with fresh dry-fit apparel & towel rental directly at reception.
          </p>

          {/* Realtime Search & Autocomplete Container */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="p-3 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search gym name, facility (Sauna, Ice Bath), or area..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 text-white rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 border border-slate-700"
                  />
                </div>

                {/* City Dropdown */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="All">All Cities</option>
                  <option value="Kemanggisan">Kemanggisan</option>
                  <option value="Grogol">Grogol</option>
                  <option value="BSD">BSD City</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Depok">Depok</option>
                </select>

                <Link href={`/search?q=${encodeURIComponent(searchTerm)}&city=${selectedCity}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-6">
                    Find Gym
                  </Button>
                </Link>
              </div>

              {/* Autocomplete Dropdown Panel */}
              {searchTerm && suggestions.length > 0 && (
                <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 max-h-60 overflow-y-auto text-left space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">
                    Suggested Gym Partners ({suggestions.length})
                  </div>
                  {suggestions.map((g) => (
                    <Link
                      key={g.id}
                      href={`/gyms/${g.id}`}
                      className="block p-2.5 hover:bg-slate-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white group-hover:text-rose-400">
                          {g.name}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {g.branch_name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Branch Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular Hubs:</span>
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/search?branch=${b.id}`}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 border border-slate-700 transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>

          {/* Feature Badges */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-300 max-w-3xl mx-auto border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2">
              <Shirt className="w-4 h-4 text-rose-500" />
              <span>Rental Clothes (XS - XXL)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sanitized Towels</span>
            </div>
            <div className="flex items-center justify-center gap-2 col-span-2 md:col-span-1">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>50+ Partner Gyms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
