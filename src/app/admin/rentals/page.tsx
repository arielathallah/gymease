'use client';

import React, { useState } from 'react';
import { Shirt, RefreshCw, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';
import { RENTAL_CLOTHES_ITEM, RENTAL_TOWEL_ITEM } from '@/lib/mock-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { ClothesSize } from '@/types';

export default function AdminRentalsPage() {
  const [sizesStock, setSizesStock] = useState(RENTAL_CLOTHES_ITEM.sizes || []);
  const [towelStock, setTowelStock] = useState(RENTAL_TOWEL_ITEM.total_stock);

  const handleUpdateStock = (sz: ClothesSize, delta: number) => {
    setSizesStock((prev) =>
      prev.map((s) => (s.size === sz ? { ...s, stock: Math.max(0, s.stock + delta) } : s))
    );
  };

  const totalClothesStock = sizesStock.reduce((acc, s) => acc + s.stock, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="rose">Apparel & Towels Inventory</Badge>
          <h1 className="text-2xl font-black text-white mt-1">
            Rental Stock Control (XS - XXL)
          </h1>
          <p className="text-xs text-slate-400">
            Manage dry-fit clothes size stock levels and microfiber towel sterilization status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RENTAL CLOTHES INVENTORY CARD */}
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-600/20 text-rose-500">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{RENTAL_CLOTHES_ITEM.name}</h3>
                <span className="text-xs text-rose-400 font-bold">{formatRupiah(RENTAL_CLOTHES_ITEM.rental_price)} per checkout</span>
              </div>
            </div>
            <Badge variant="rose">Total Stock: {totalClothesStock}</Badge>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Stock Breakdown by Clothes Size (XS to XXL):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sizesStock.map((s) => (
                <div key={s.size} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 font-black flex items-center justify-center">
                      {s.size}
                    </span>
                    <span className="font-bold text-white">Size {s.size}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStock(s.size, -1)}
                      className="w-7 h-7 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                    >
                      -
                    </button>
                    <span className="font-bold text-rose-400 min-w-[20px] text-center">{s.stock}</span>
                    <button
                      onClick={() => handleUpdateStock(s.size, 1)}
                      className="w-7 h-7 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* RENTAL TOWELS INVENTORY CARD */}
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{RENTAL_TOWEL_ITEM.name}</h3>
                <span className="text-xs text-emerald-400 font-bold">{formatRupiah(RENTAL_TOWEL_ITEM.rental_price)} per checkout</span>
              </div>
            </div>
            <Badge variant="emerald">Stock: {towelStock}</Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sanitization & Washing Protocol
              </div>
              <p className="text-slate-400">
                All towels undergo high-temperature thermal washing at 90°C and individual poly-bag sealing before distribution to reception lockers.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="font-bold text-white">Current Clean Towels in Locker</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTowelStock(Math.max(0, towelStock - 5))}
                  className="px-2.5 py-1 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                >
                  -5
                </button>
                <span className="font-black text-emerald-400 text-sm">{towelStock}</span>
                <button
                  onClick={() => setTowelStock(towelStock + 5)}
                  className="px-2.5 py-1 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
