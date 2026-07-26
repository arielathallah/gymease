'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Shirt, CheckCircle2, QrCode, Tag, ArrowRight, ArrowLeft, ShieldCheck, Dumbbell, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatRupiah, generateBookingCode } from '@/lib/utils';
import { RENTAL_CLOTHES_ITEM, RENTAL_TOWEL_ITEM, PROMO_CODES } from '@/lib/mock-data';
import { ClothesSize, Booking } from '@/types';
import { QRModal } from '@/components/common/QRModal';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentRole, setRole, branches, gyms, packages, addBooking } = useAppStore();

  // URL Params initialization
  const initialGymId = searchParams.get('gymId') || gyms[0].id;
  const initialPkgId = searchParams.get('pkgId') || packages[0].id;

  // Step State (1..6)
  const [step, setStep] = useState(1);

  // Selection States
  const [selectedBranchId, setSelectedBranchId] = useState(gyms[0].branch_id);
  const [selectedGymId, setSelectedGymId] = useState(initialGymId);
  const [bookingDate, setBookingDate] = useState('2026-07-25');
  const [bookingTime, setBookingTime] = useState('17:00');
  const [selectedPackageId, setSelectedPackageId] = useState(initialPkgId);

  // Rental Clothes State
  const [clothesChecked, setClothesChecked] = useState(true);
  const [clothesSize, setClothesSize] = useState<ClothesSize>('L');
  const [clothesQty, setClothesQty] = useState(1);

  // Rental Towel State
  const [towelChecked, setTowelChecked] = useState(true);
  const [towelQty, setTowelQty] = useState(1);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('GYMEASE20');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>({
    code: 'GYMEASE20',
    discount: 20000,
  });
  const [promoError, setPromoError] = useState('');

  // Confirmation & QR Modal
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Filter Gyms by selected branch
  const availableGyms = gyms.filter((g) => g.branch_id === selectedBranchId);
  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const currentGym = gyms.find((g) => g.id === selectedGymId) || availableGyms[0] || gyms[0];
  const currentPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];

  // Stock helper for clothes size
  const selectedSizeStock =
    RENTAL_CLOTHES_ITEM.sizes?.find((s) => s.size === clothesSize)?.stock || 10;

  // Calculate Subtotal & Totals
  const pkgPrice = currentPackage.price;
  const clothesPriceTotal = clothesChecked ? RENTAL_CLOTHES_ITEM.rental_price * clothesQty : 0;
  const towelPriceTotal = towelChecked ? RENTAL_TOWEL_ITEM.rental_price * towelQty : 0;

  const subtotal = pkgPrice + clothesPriceTotal + towelPriceTotal;
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.1); // 10% tax
  const grandTotal = taxableAmount + taxAmount;

  // Apply Voucher Handler
  const handleApplyVoucher = () => {
    setPromoError('');
    const codeObj = PROMO_CODES.find((c) => c.code.toUpperCase() === promoInput.trim().toUpperCase());
    if (codeObj) {
      let calcDisc = 0;
      if (codeObj.discount_percentage > 0) {
        calcDisc = Math.min(codeObj.max_discount, Math.round((subtotal * codeObj.discount_percentage) / 100));
      } else {
        calcDisc = codeObj.discount_amount;
      }
      setAppliedPromo({ code: codeObj.code, discount: calcDisc });
    } else {
      setPromoError('Invalid promo voucher code.');
      setAppliedPromo(null);
    }
  };

  // Complete Checkout Handler
  const handleConfirmCheckout = () => {
    if (currentRole === 'guest') {
      setLoginPromptOpen(true);
      return;
    }

    const bookingCode = generateBookingCode(currentBranch.code);
    const newBookingData = {
      booking_code: bookingCode,
      user_id: 'u1',
      user_name: 'Budi Santoso',
      user_email: 'budi.santoso@gmail.com',
      branch_id: currentBranch.id,
      branch_name: currentBranch.name,
      gym_id: currentGym.id,
      gym_name: currentGym.name,
      package_id: currentPackage.id,
      package_name: currentPackage.name,
      package_price: currentPackage.price,
      booking_date: bookingDate,
      booking_time: bookingTime,
      rentals: {
        clothesSelected: clothesChecked,
        clothesSize,
        clothesQty,
        clothesPrice: RENTAL_CLOTHES_ITEM.rental_price,
        towelSelected: towelChecked,
        towelQty,
        towelPrice: RENTAL_TOWEL_ITEM.rental_price,
      },
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      promo_code: appliedPromo?.code,
      status: 'confirmed' as const,
      qr_code_url: bookingCode,
    };

    const saved = addBooking(newBookingData);
    setCompletedBooking(saved);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Wizard Steps Header */}
        <div className="mb-8">
          <Badge variant="rose" className="mb-2">Interactive Checkout Wizard</Badge>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Book Gym Pass & Apparel Rental
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Follow the steps below to reserve your workout slot and sanitized rental gear.
          </p>

          {/* Stepper Indicator */}
          <div className="mt-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto gap-2 text-xs font-bold">
            {[
              { num: 1, name: 'Branch' },
              { num: 2, name: 'Partner Gym' },
              { num: 3, name: 'Date & Time' },
              { num: 4, name: 'Package' },
              { num: 5, name: 'Rental Apparel' },
              { num: 6, name: 'Summary & Checkout' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  step === s.num
                    ? 'bg-rose-600 text-white shadow-md'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.name}</span>
                {step > s.num && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: CHOOSE BRANCH */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Select GymEase Branch Hub</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {branches.map((b) => (
                <Card
                  key={b.id}
                  onClick={() => {
                    setSelectedBranchId(b.id);
                    // auto select first gym in branch
                    const matchingGym = gyms.find((g) => g.branch_id === b.id);
                    if (matchingGym) setSelectedGymId(matchingGym.id);
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedBranchId === b.id
                      ? 'border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/30'
                      : 'hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{b.name}</span>
                    {selectedBranchId === b.id && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                  </div>
                  <span className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {b.city}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{b.address}</p>
                </Card>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)}>Next: Choose Gym →</Button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE GYM */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                2. Select Partner Gym in {currentBranch.name}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                ← Change Branch
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableGyms.map((g) => (
                <Card
                  key={g.id}
                  onClick={() => setSelectedGymId(g.id)}
                  className={`p-4 cursor-pointer transition-all flex gap-4 ${
                    selectedGymId === g.id
                      ? 'border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/30'
                      : 'hover:border-slate-400'
                  }`}
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img src={g.main_image} alt={g.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{g.name}</h4>
                      {selectedGymId === g.id && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{g.description}</p>
                    <span className="text-[11px] font-bold text-amber-500">⭐ {g.rating} ({g.total_reviews} reviews)</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next: Pick Date & Time →</Button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE DATE & TIME */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in max-w-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Select Date & Time Slot</h3>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Workout Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Select Time Slot</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {['06:00', '08:00', '10:00', '14:00', '16:00', '17:00', '19:00', '20:00'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setBookingTime(time)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-colors ${
                        bookingTime === time
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Next: Select Package →</Button>
            </div>
          </div>
        )}

        {/* STEP 4: CHOOSE PACKAGE */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">4. Select Pass Package</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-5 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPackageId === pkg.id
                      ? 'border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/30'
                      : 'hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{pkg.name}</span>
                      {selectedPackageId === pkg.id && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                    </div>
                    <p className="text-xs text-slate-400">{pkg.description}</p>
                    <div className="text-xl font-black text-rose-600 dark:text-rose-400 pt-2">
                      {formatRupiah(pkg.price)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => setStep(5)}>Next: Apparel & Towels →</Button>
            </div>
          </div>
        )}

        {/* STEP 5: RENTAL CLOTHES & TOWELS (VERY IMPORTANT REQUIREMENTS) */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shirt className="w-6 h-6 text-rose-500" /> 5. Select Workout Apparel & Towels Rental
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Workout hands-free! Pick fresh dry-fit clothes & sanitized microfiber towels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RENTAL CLOTHES BOX */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clothesChecked}
                      onChange={(e) => setClothesChecked(e.target.checked)}
                      className="w-5 h-5 accent-rose-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        Rental Clothes (Dry-Fit Set)
                      </span>
                      <span className="text-xs text-rose-500 font-bold">
                        {formatRupiah(RENTAL_CLOTHES_ITEM.rental_price)} / visit
                      </span>
                    </div>
                  </label>
                  <Badge variant="rose">XS - XXL</Badge>
                </div>

                {clothesChecked && (
                  <div className="space-y-4 pt-2 animate-in fade-in">
                    {/* Size Selector XS, S, M, L, XL, XXL */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-2">
                        <span className="text-slate-700 dark:text-slate-300">Choose Size:</span>
                        <span className="text-emerald-500">In Stock: {selectedSizeStock} sets</span>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ClothesSize[]).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setClothesSize(sz)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                              clothesSize === sz
                                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setClothesQty(Math.max(1, clothesQty - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm">{clothesQty}</span>
                        <button
                          onClick={() => setClothesQty(Math.min(selectedSizeStock, clothesQty + 1))}
                          className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RENTAL TOWELS BOX */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={towelChecked}
                      onChange={(e) => setTowelChecked(e.target.checked)}
                      className="w-5 h-5 accent-rose-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        Rental Towel (Microfiber)
                      </span>
                      <span className="text-xs text-rose-500 font-bold">
                        {formatRupiah(RENTAL_TOWEL_ITEM.rental_price)} / visit
                      </span>
                    </div>
                  </label>
                  <Badge variant="emerald">Stock: {RENTAL_TOWEL_ITEM.total_stock}</Badge>
                </div>

                {towelChecked && (
                  <div className="space-y-4 pt-2 animate-in fade-in">
                    <p className="text-xs text-slate-400">
                      High absorbency microfiber towel, sanitized with 90°C hot wash protocol.
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setTowelQty(Math.max(1, towelQty - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm">{towelQty}</span>
                        <button
                          onClick={() => setTowelQty(towelQty + 1)}
                          className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
              <Button onClick={() => setStep(6)}>Next: Summary & Checkout →</Button>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & CHECKOUT (VERY IMPORTANT REQUIREMENTS) */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">6. Review Booking Summary & Checkout</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Reservation Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Branch Hub</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currentBranch.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Gym Partner</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currentGym.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date & Time Slot</span>
                      <span className="font-bold text-slate-900 dark:text-white">{bookingDate} @ {bookingTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pass Package</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currentPackage.name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Rental Equipment Items
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Clothes Rental ({clothesChecked ? `Size ${clothesSize}, Qty ${clothesQty}` : 'None'})</span>
                      <span className="font-bold">{formatRupiah(clothesPriceTotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Towel Rental ({towelChecked ? `Qty ${towelQty}` : 'None'})</span>
                      <span className="font-bold">{formatRupiah(towelPriceTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-rose-500" /> Apply Voucher / Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. GYMEASE20"
                      className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <Button size="sm" onClick={handleApplyVoucher}>
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Promo {appliedPromo.code} applied! Saved {formatRupiah(appliedPromo.discount)}
                    </div>
                  )}
                  {promoError && <p className="text-xs text-red-500 font-bold">{promoError}</p>}
                </div>
              </div>

              {/* Right Order Summary Box */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <h4 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                    Booking Summary
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Pass Package Subtotal</span>
                      <span className="font-semibold">{formatRupiah(pkgPrice)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Rental Gear Subtotal</span>
                      <span className="font-semibold">{formatRupiah(clothesPriceTotal + towelPriceTotal)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Gross Subtotal</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>Discount (Voucher)</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Tax & Service (10%)</span>
                      <span className="font-semibold">{formatRupiah(taxAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 dark:border-slate-700 font-black text-lg text-slate-900 dark:text-white">
                      <span>Grand Total</span>
                      <span className="text-rose-600 dark:text-rose-400">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full text-base font-bold shadow-xl" onClick={handleConfirmCheckout}>
                    Confirm & Complete Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR MODAL TICKET */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          router.push('/dashboard/bookings');
        }}
        booking={completedBooking}
      />

      {/* LOGIN REQUIRED MODAL PROMPT FOR GUEST */}
      <Modal isOpen={loginPromptOpen} onClose={() => setLoginPromptOpen(false)} title="Login Required For Booking">
        <div className="space-y-4 text-center">
          <p className="text-xs text-slate-400">
            Per system rules, guest users can browse every feature, but login is required to complete booking & checkout.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => {
                setRole('user');
                setLoginPromptOpen(false);
                handleConfirmCheckout();
              }}
            >
              Simulate Login as Registered User & Complete
            </Button>
            <Button variant="outline" onClick={() => setLoginPromptOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
