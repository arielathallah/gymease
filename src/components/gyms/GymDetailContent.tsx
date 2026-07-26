'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, ShieldCheck, Shirt, ExternalLink, Calendar, Dumbbell, Navigation, CheckCircle2, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { formatRupiah } from '@/lib/utils';
import { RENTAL_CLOTHES_ITEM, RENTAL_TOWEL_ITEM } from '@/lib/mock-data';

export default function GymDetailPage({ params }: { params: { id: string } }) {
  const { gyms, packages, products, reviews, wishlistGymIds, toggleWishlistGym } = useAppStore();

  const gym = gyms.find((g) => g.id === params.id) || gyms[0]; // Fallback to first gym if ID not matched
  const isFav = wishlistGymIds.includes(gym.id);

  const [activeImage, setActiveImage] = useState(gym.main_image);

  // Filter packages for this gym or branch
  const gymPackages = packages.filter((p) => p.gym_id === gym.id || p.branch_id === gym.branch_id || !p.gym_id);
  const gymProducts = products.filter((p) => p.branch_id === gym.branch_id);

  const googleMapsDirectionUrl = gym.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-rose-500">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-rose-500">Gyms</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{gym.name}</span>
        </div>

        {/* Title & Top Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="rose">{gym.branch_name}</Badge>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {gym.rating} ({gym.total_reviews} reviews)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
              {gym.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              Latitude: {gym.latitude}, Longitude: {gym.longitude} | Open {gym.opening_hours} - {gym.closing_hours}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleWishlistGym(gym.id)}
              className={`p-3 rounded-xl border transition-colors flex items-center gap-2 text-xs font-bold ${
                isFav
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              {isFav ? 'Wishlisted' : 'Add Wishlist'}
            </button>

            <a href={googleMapsDirectionUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="md" className="flex items-center gap-2 text-xs">
                <Navigation className="w-4 h-4 text-rose-500" />
                Google Maps Directions
              </Button>
            </a>

            <Link href={`/booking?gymId=${gym.id}`}>
              <Button size="md" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Book Gym Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 relative h-96 sm:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
            <Image src={activeImage} alt={gym.name} fill className="object-cover" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {gym.gallery.map((imgUrl, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative h-28 lg:h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  activeImage === imgUrl ? 'border-rose-500 scale-[0.98]' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <Image src={imgUrl} alt="Gym thumbnail" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Main Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-rose-500" /> About {gym.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {gym.description}
              </p>
            </div>

            {/* Facilities */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Included Facilities & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gym.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {fac}
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Kit Included Options */}
            <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-rose-800/60 text-white space-y-4">
              <div className="flex items-center gap-2">
                <Shirt className="w-6 h-6 text-rose-400" />
                <h3 className="text-lg font-bold">On-Demand Workout Apparel & Towels Rental</h3>
              </div>
              <p className="text-xs text-slate-300">
                You can select your dry-fit workout clothes size (XS, S, M, L, XL, XXL) & microfiber towel directly during online checkout!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="font-bold text-sm text-rose-400">{RENTAL_CLOTHES_ITEM.name}</div>
                  <p className="text-[11px] text-slate-400">{RENTAL_CLOTHES_ITEM.description}</p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-amber-400">{formatRupiah(RENTAL_CLOTHES_ITEM.rental_price)} / visit</span>
                    <span className="text-[10px] bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded border border-rose-800">Sizes: XS - XXL</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="font-bold text-sm text-rose-400">{RENTAL_TOWEL_ITEM.name}</div>
                  <p className="text-[11px] text-slate-400">{RENTAL_TOWEL_ITEM.description}</p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-amber-400">{formatRupiah(RENTAL_TOWEL_ITEM.rental_price)} / visit</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-800">Sterilized at 90°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Available Gym Pass Packages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gymPackages.map((pkg) => (
                  <Card key={pkg.id} className="p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{pkg.name}</span>
                        {pkg.is_popular && <Badge variant="rose">POPULAR</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pkg.description}</p>
                      <ul className="space-y-1 pt-2">
                        {pkg.benefits.map((b, i) => (
                          <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {formatRupiah(pkg.price)}
                      </span>
                      <Link href={`/booking?gymId=${gym.id}&pkgId=${pkg.id}`}>
                        <Button size="sm">Select Pass</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Member Reviews</h3>
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{rev.user_name}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Box */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold">Pass Pricing Starts At</span>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                  {formatRupiah(50000)} <span className="text-xs text-slate-400 font-normal">/ day pass</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Branch Hub</span>
                  <span className="font-bold text-slate-900 dark:text-white">{gym.branch_name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Opening Hours</span>
                  <span className="font-bold text-slate-900 dark:text-white">{gym.opening_hours} - {gym.closing_hours}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Apparel Rental</span>
                  <span className="font-bold text-emerald-500">Available (XS-XXL)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-in Method</span>
                  <span className="font-bold text-rose-500">Instant QR Code</span>
                </div>
              </div>

              <Link href={`/booking?gymId=${gym.id}`} className="block">
                <Button size="lg" className="w-full text-base font-bold shadow-xl">
                  Proceed to Booking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
