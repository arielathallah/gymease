'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, CreditCard, Calendar, Clock, ShoppingBag, 
  Shirt, ShieldCheck, CheckCircle2, Sparkles, Upload 
} from 'lucide-react';
import { getGymById } from '@/services/gym';
import { listPackagesByGymId } from '@/services/package';
import { listProducts } from '@/services/product';
import { getCurrentUser } from '@/services/user';
import { createBooking } from '@/services/booking';
import { Gym, GymPackage, Product, Profile } from '@/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gymId = searchParams.get('gymId') || '';
  const packageId = searchParams.get('packageId') || '';

  // Auth State
  const [user, setUser] = useState<Profile | null>(null);
  
  // Data State
  const [gym, setGym] = useState<Gym | null>(null);
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Input States
  const [selectedPkgId, setSelectedPkgId] = useState(packageId);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('17:00');
  const [selectedItems, setSelectedItems] = useState<Record<string, { selected: boolean; size?: string; qty: number }>>({});
  const [laundryOption, setLaundryOption] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'e_wallet'>('qris');
  
  // File Upload
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadCheckoutData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // If not logged in, redirect to login page with callback
          const currentUrl = `/checkout?gymId=${gymId}&packageId=${packageId}`;
          router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`);
          return;
        }

        setUser(currentUser);

        const [loadedGym, loadedPkgs, loadedProds] = await Promise.all([
          getGymById(gymId),
          listPackagesByGymId(gymId),
          listProducts()
        ]);

        if (!loadedGym) {
          router.push('/');
          return;
        }

        setGym(loadedGym);
        setPackages(loadedPkgs);
        setProducts(loadedProds);
        
        // Setup initial selected package
        if (packageId) {
          setSelectedPkgId(packageId);
        } else if (loadedPkgs.length > 0) {
          setSelectedPkgId(loadedPkgs[0].id);
        }

        // Initialize booking date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingDate(tomorrow.toISOString().split('T')[0]);

        // Initialize items map
        const initialItems: typeof selectedItems = {};
        loadedProds.forEach(p => {
          initialItems[p.id] = {
            selected: false,
            qty: 1,
            size: p.category === 'shirt' || p.category === 'shorts' ? 'M' : undefined
          };
        });
        setSelectedItems(initialItems);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCheckoutData();
  }, [gymId, packageId]);

  // Handle product selection toggle
  const toggleItem = (productId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selected: !prev[productId].selected
      }
    }));
  };

  // Handle product size configuration
  const setItemSize = (productId: string, size: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size
      }
    }));
  };

  // Calculations
  const selectedPackage = packages.find(p => p.id === selectedPkgId);
  const packagePrice = selectedPackage ? Number(selectedPackage.price) : 0;
  
  let itemsSubtotal = 0;
  const activeItemsList: any[] = [];

  Object.entries(selectedItems).forEach(([prodId, details]) => {
    if (details.selected) {
      const prod = products.find(p => p.id === prodId);
      if (prod) {
        itemsSubtotal += Number(prod.price) * details.qty;
        activeItemsList.push({
          product_id: prodId,
          size: details.size || null,
          quantity: details.qty,
          price: prod.price
        });
      }
    }
  });

  const laundryPrice = laundryOption ? 20000 : 0;
  const subtotal = packagePrice + itemsSubtotal + laundryPrice;
  const tax = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + tax;

  // Handle receipt upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !gym || !selectedPkgId) return;

    if (!bookingDate) {
      setErrorMsg('Harap tentukan tanggal pemesanan.');
      return;
    }

    if (!paymentProofFile) {
      setErrorMsg('Harap unggah bukti transfer pembayaran Anda.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Submit Booking
      const booking = await createBooking(
        {
          user_id: user.id,
          gym_id: gym.id,
          package_id: selectedPkgId,
          booking_date: bookingDate,
          booking_time: bookingTime,
          laundry_option: laundryOption
        },
        activeItemsList,
        paymentMethod,
        paymentProofPreview // Using the preview URL as path in mock DB
      );

      // Redirect to customer dashboard on success
      router.push('/dashboard?bookingSuccess=true');
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal memproses checkout. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Menyiapkan checkout...</p>
      </div>
    );
  }

  if (!gym || !selectedPackage) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="text-left">
        <Link 
          href={`/gyms/${gym.id}`} 
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Gym</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Checkout Form (8 columns) */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">Selesaikan Pemesanan</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Silakan tentukan jadwal kedatangan, sewa produk, dan lakukan pembayaran.</p>
          </div>

          {/* Section 1: Schedule Date & Time */}
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2 font-display">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>1. Jadwal Kedatangan</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Tanggal Workout</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Prakiraan Waktu Kedatangan</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                  required
                />
                <span className="text-[10px] text-zinc-400 block mt-1 leading-normal">* Jam operasional gym mitra: {gym.operating_hours} WIB.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Rental Items Selection */}
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2 font-display">
              <Shirt className="w-5 h-5 text-emerald-400" />
              <span>2. Layanan Rental Tambahan (Opsional)</span>
            </h3>
            <p className="text-zinc-400 text-xs mt-1">Sewa baju, celana, handuk, atau loker digital. Pakaian sudah higienis, bersih, dan harum.</p>

            <div className="space-y-4 pt-2">
              {products.map((prod) => {
                const details = selectedItems[prod.id];
                const isSelected = details?.selected || false;
                const isClothing = prod.category === 'shirt' || prod.category === 'shorts';

                return (
                  <div 
                    key={prod.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : 'border-zinc-200 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(prod.id)}
                        className="mt-1.5 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500 h-4.5 w-4.5"
                      />
                      
                      {/* Thumbnail */}
                      <img 
                        src={prod.photo_url} 
                        alt={prod.name} 
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                      />

                      {/* Detail Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{prod.name}</h4>
                          <span className="text-xs font-bold text-emerald-400">Rp {prod.price.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{prod.description}</p>
                        
                        {/* Size Selection rendering if selected and is clothing */}
                        {isSelected && isClothing && (
                          <div className="pt-2 space-y-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-400">Pilih Ukuran Pakaian</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                                <button
                                  type="button"
                                  key={sz}
                                  onClick={() => setItemSize(prod.id, sz)}
                                  className={`w-8 h-8 rounded-lg font-semibold text-xs border transition-all flex items-center justify-center ${
                                    details.size === sz
                                      ? 'bg-emerald-500 border-emerald-500 text-black shadow'
                                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Laundry Service */}
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>3. Laundry Baju Olahraga (Opsional)</span>
            </h3>
            
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={laundryOption}
                onChange={() => setLaundryOption(!laundryOption)}
                className="mt-1 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500 h-4.5 w-4.5"
              />
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Layanan Laundry Baju Olahraga</h4>
                  <span className="text-xs font-bold text-emerald-400">+Rp 20.000</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Setelah berolahraga, Anda tidak perlu membawa pulang baju sewaan yang basah kuyup oleh keringat. Letakkan saja di keranjang pengembalian resepsionis, kami yang mencucinya!
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Payment instructions */}
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-6">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2 font-display">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>4. Metode Pembayaran</span>
            </h3>

            {/* Select Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(['qris', 'bank_transfer', 'e_wallet'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    paymentMethod === m
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {m === 'qris' ? 'QRIS (Gopay/OVO)' : m === 'bank_transfer' ? 'Transfer Bank' : 'E-Wallet'}
                </button>
              ))}
            </div>

            {/* Render selected instructions */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-150 dark:border-zinc-900 text-xs space-y-4">
              {paymentMethod === 'qris' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Mock QR Code */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-zinc-200 shrink-0">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=GymEasePaymentSim" 
                      alt="QRIS Code GymEase" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5 leading-normal">
                    <h4 className="font-bold text-zinc-900 dark:text-white">Scan Kode QRIS</h4>
                    <p className="text-[10px] text-zinc-400">Scan QR di atas menggunakan dompet digital Anda (GoPay, OVO, Dana, LinkAja, BCA Mobile) sebesar:</p>
                    <p className="text-base font-extrabold text-emerald-500">Rp {grandTotal.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-500 font-mono italic">* Nama merchant: GYMEASE PLATFORM INDONESIA</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-3 leading-normal">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Detail Transfer Bank</h4>
                  <p className="text-[10px] text-zinc-400">Silakan lakukan transfer senilai <span className="text-emerald-400 font-bold">Rp {grandTotal.toLocaleString()}</span> ke rekening berikut:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-900/60 font-mono">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-sans block">Bank Central Asia (BCA)</span>
                      <span className="font-bold text-zinc-900 dark:text-white text-sm">987-6543-210</span>
                      <span className="text-[10px] text-zinc-500 font-sans block mt-0.5">a.n GymEase Indonesia</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-900/60 font-mono">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-sans block">Bank Mandiri</span>
                      <span className="font-bold text-zinc-900 dark:text-white text-sm">123-45678-9012</span>
                      <span className="text-[10px] text-zinc-500 font-sans block mt-0.5">a.n GymEase Indonesia</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'e_wallet' && (
                <div className="space-y-2 leading-normal">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Instruksi E-Wallet Direct</h4>
                  <p className="text-[10px] text-zinc-400">Kirim dana ke nomor e-wallet resmi kami:</p>
                  <p className="font-mono text-zinc-900 dark:text-white font-bold">GOPAY / OVO / DANA: <span className="text-emerald-400">0812-3456-7890</span></p>
                  <p className="text-[10px] text-zinc-500">Ketik catatan berita transfer: <span className="font-bold text-indigo-400 font-mono">GymEase Booking</span></p>
                </div>
              )}

              {/* Upload Proof inputs */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900/80">
                <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-2">Unggah Bukti Transfer / Pembayaran</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full sm:w-44 h-24 border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 rounded-xl transition-colors bg-white dark:bg-zinc-900/20 text-zinc-400">
                    <Upload className="w-5 h-5 mb-1 text-zinc-400" />
                    <span className="text-[10px] font-bold">Pilih File Foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      required 
                    />
                  </label>

                  {paymentProofPreview ? (
                    <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden border border-zinc-200">
                      <img 
                        src={paymentProofPreview} 
                        alt="Proof Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500">File belum dipilih. Harap unggah foto struk/screenshot pembayaran Anda.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Right Order Summary Panel (4 columns) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="glass bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display border-b border-zinc-150 dark:border-zinc-900/60 pb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <span>Ringkasan Pesanan</span>
            </h3>

            {/* Summary Details */}
            <div className="space-y-4 text-xs">
              
              {/* Gym info */}
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-zinc-400">Gym Terpilih</span>
                <p className="font-bold text-zinc-900 dark:text-white">{gym.name}</p>
                <p className="text-[10px] text-zinc-500 line-clamp-1">{gym.address}</p>
              </div>

              {/* Package info */}
              <div className="flex justify-between items-center py-2 border-y border-zinc-100 dark:border-zinc-900/60">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Paket Tiket Masuk</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedPackage.name}</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">Rp {packagePrice.toLocaleString()}</span>
              </div>

              {/* Booking date summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Tanggal Kedatangan</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{bookingDate || 'Belum dipilih'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Perkiraan Jam</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{bookingTime} WIB</span>
                </div>
              </div>

              {/* Selected rentals list summary */}
              {activeItemsList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Perlengkapan Sewa</span>
                  <div className="space-y-1.5">
                    {activeItemsList.map((item, idx) => {
                      const prod = products.find(p => p.id === item.product_id);
                      return (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-zinc-600 dark:text-zinc-300">
                            {prod?.name} {item.size ? `(Size ${item.size})` : ''}
                          </span>
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            Rp {Number(item.price).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Laundry info summary */}
              {laundryOption && (
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-zinc-600 dark:text-zinc-300">Layanan Laundry Baju Olahraga</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Rp 20.000</span>
                </div>
              )}

              {/* Total calculations */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-900 dark:text-white">Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-500">Pajak (11% PPN)</span>
                  <span className="font-bold text-zinc-900 dark:text-white">Rp {tax.toLocaleString()}</span>
                </div>
                
                <hr className="border-zinc-200 dark:border-zinc-900" />
                
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="font-bold text-zinc-900 dark:text-white">Total Pembayaran</span>
                  <span className="text-base font-extrabold text-emerald-500 dark:text-emerald-400">
                    Rp {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* Error notifications */}
            {errorMsg && (
              <p className="text-xs text-rose-500 font-semibold text-center leading-relaxed">{errorMsg}</p>
            )}

            {/* Submit checkout button */}
            <button
              onClick={handleCheckoutSubmit}
              disabled={submitting}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 shadow-lg cursor-pointer"
            >
              <span>{submitting ? 'Memproses Booking...' : 'Saya Sudah Transfer, Kirim Pemesanan'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-zinc-500 leading-relaxed text-center">
              Pemesanan Anda akan berada dalam status <span className="font-bold text-amber-500">Pending</span> menunggu verifikasi bukti transfer oleh Admin.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm font-mono">Menyiapkan halaman...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
