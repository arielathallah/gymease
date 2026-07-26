'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, Heart, CheckCircle2, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';

export default function ProductsPage() {
  const { products, wishlistProductIds, toggleWishlistProduct } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Supplements', 'Gear', 'Accessories'];

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'All' || p.category_name === selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="rose">Official Fitness Shop</Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
              Gym Products & Fitness Accessories
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Purchase supplements, lifting straps, and shaker bottles pickup at partner branches.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const isFav = wishlistProductIds.includes(prod.id);
            return (
              <Card key={prod.id} className="group flex flex-col justify-between">
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image src={prod.main_image} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => toggleWishlistProduct(prod.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-rose-600 text-white' : 'bg-slate-900/60 text-white hover:bg-rose-600'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <CardBody className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="emerald">{prod.category_name || 'Supplements'}</Badge>
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {prod.rating}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {prod.branch_name}
                      </span>
                      <span className="font-semibold text-emerald-500">In Stock: {prod.stock}</span>
                    </div>
                  </CardBody>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                    {formatRupiah(prod.price)}
                  </span>
                  <Button size="sm" className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Order Product
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
