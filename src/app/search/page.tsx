'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Filter, Star, Clock, Heart, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function SearchPage() {
  const { gyms, branches, wishlistGymIds, toggleWishlistGym } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const allFacilities = [
    'Locker Room',
    'Shower',
    'Sauna',
    'Personal Trainer',
    'WiFi',
    'Ice Bath',
    'Spin Studio',
    'Sprint Track',
  ];

  // Filtered Gyms logic
  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) => {
      const matchesSearch =
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.branch_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = selectedBranch === 'All' || gym.branch_id === selectedBranch;

      const matchesFacility =
        selectedFacility === 'All' || gym.facilities.includes(selectedFacility);

      const matchesRating = gym.rating >= minRating;

      return matchesSearch && matchesBranch && matchesFacility && matchesRating;
    });
  }, [gyms, searchQuery, selectedBranch, selectedFacility, minRating]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <Badge variant="rose">Realtime Search & Filter</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">
            Find Gym Partners Across Indonesia
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Filter by city, branch, amenities, rating, and operating hours.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gym name, location, or facility..."
              className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters */}
          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit shadow-md">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="w-5 h-5 text-rose-500" />
              Filter System
            </div>

            {/* Branch Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="All">All Branches (Indonesia)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Facilities Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Facility Filter
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="All">All Facilities</option>
                {allFacilities.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      minRating === rate
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rate === 0 ? 'Any' : `${rate}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters CTA */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-rose-500 hover:text-rose-600"
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('All');
                setSelectedFacility('All');
                setMinRating(0);
              }}
            >
              Reset All Filters
            </Button>
          </div>

          {/* Right Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span>Showing {filteredGyms.length} Gym Partner Results</span>
            </div>

            {filteredGyms.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <Search className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Gym Partners Found</h3>
                <p className="text-xs text-slate-400">Try loosening your search query or branch filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGyms.map((gym) => {
                  const isFav = wishlistGymIds.includes(gym.id);
                  return (
                    <Card key={gym.id} className="group flex flex-col justify-between">
                      <div>
                        {/* Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                          <Image
                            src={gym.main_image}
                            alt={gym.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => toggleWishlistGym(gym.id)}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md z-10 transition-colors ${
                              isFav ? 'bg-rose-600 text-white' : 'bg-slate-900/60 text-white hover:bg-rose-600'
                            }`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {/* Body */}
                        <CardBody className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {gym.branch_name}
                            </span>
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {gym.rating} ({gym.total_reviews})
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                            {gym.name}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {gym.description}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {gym.facilities.slice(0, 3).map((f, i) => (
                              <Badge key={i} variant="slate" className="text-[10px]">
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </CardBody>
                      </div>

                      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {gym.opening_hours} - {gym.closing_hours}
                        </span>
                        <Link href={`/gyms/${gym.id}`}>
                          <Button size="sm">Book Pass</Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
