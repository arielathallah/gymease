'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Star, MapPin, Clock, Search, ArrowRight, Check, HelpCircle, 
  Briefcase, Shirt, Sparkles, Filter, RefreshCw, ChevronDown, Award
} from 'lucide-react';
import { listGyms } from '@/services/gym';
import { listProducts } from '@/services/product';
import { listPackages } from '@/services/package';
import { listFaqs } from '@/services/faq';
import { getCurrentUser } from '@/services/user';
import { Gym, Product, GymPackage, FAQItem } from '@/types';

// Dynamically import map component to disable SSR
const GymMap = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-900">
      <span className="text-sm text-zinc-500 font-mono">Memuat peta interaktif...</span>
    </div>
  )
});

export default function LandingPage() {
  const router = useRouter();
  
  // Data State
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // FAQ Accordion State
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Current User
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedGyms, loadedProducts, loadedPackages, loadedFaqs, user] = await Promise.all([
          listGyms(),
          listProducts(),
          listPackages(),
          listFaqs(),
          getCurrentUser()
        ]);
        
        setGyms(loadedGyms);
        setProducts(loadedProducts);
        setPackages(loadedPackages);
        setFaqs(loadedFaqs);
        setIsLoggedIn(!!user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Logic
  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gym.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === 'All' || 
                        gym.address.toLowerCase().includes(selectedCity.toLowerCase());
    
    const matchesFacility = selectedFacility === 'All' || 
                            gym.facilities.includes(selectedFacility);
    
    // Starting price logic based on packages associated with the gym
    const gymPackages = packages.filter(p => p.gym_id === gym.id);
    const minGymPrice = gymPackages.length > 0 ? Math.min(...gymPackages.map(p => p.price)) : 0;
    const matchesPrice = minGymPrice <= maxPrice;

    // Hardcoded ratings for dynamic filter simulation
    const ratingMap: Record<string, number> = { 'gym-1': 4.9, 'gym-2': 4.7, 'gym-3': 4.8 };
    const gymRating = ratingMap[gym.id] || 4.5;
    const matchesRating = gymRating >= selectedRating;

    return matchesSearch && matchesCity && matchesFacility && matchesPrice && matchesRating && gym.status === 'active';
  });

  const getGymStartingPrice = (gymId: string) => {
    const gymPackages = packages.filter(p => p.gym_id === gymId);
    if (gymPackages.length === 0) return 'Rp 0';
    const minPrice = Math.min(...gymPackages.map(p => p.price));
    return `Rp ${minPrice.toLocaleString()}`;
  };

  const getGymRating = (gymId: string) => {
    const ratingMap: Record<string, number> = { 'gym-1': 4.9, 'gym-2': 4.7, 'gym-3': 4.8 };
    return ratingMap[gymId] || 4.5;
  };

  const handleBook = (gymId: string, packageId?: string) => {
    const targetPackageId = packageId || packages.find(p => p.gym_id === gymId)?.id || '';
    const checkoutUrl = `/checkout?gymId=${gymId}&packageId=${targetPackageId}`;
    
    if (isLoggedIn) {
      router.push(checkoutUrl);
    } else {
      router.push(`/login?redirectTo=${encodeURIComponent(checkoutUrl)}`);
    }
  };

  // Get distinct facilities for filter dropdown
  const allFacilities = Array.from(new Set(gyms.flatMap(g => g.facilities)));

  return (
    <div className="relative">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] glow-bg rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] glow-bg rounded-full pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solusi Pekerja Perkantoran</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] font-display">
              Gym Tanpa Ribet <br />
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
                Setelah Kerja
              </span>
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
              Kami menyediakan pakaian olahraga, handuk, locker, dan laundry sehingga Anda hanya perlu datang dan berolahraga langsung sepulang kantor.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="#gyms" 
                className="px-6 py-3.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>Cari Gym Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => {
                  if (gyms.length > 0) {
                    handleBook(gyms[0].id);
                  } else {
                    router.push('/login');
                  }
                }}
                className="px-6 py-3.5 text-sm font-semibold glass border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 rounded-xl transition-all"
              >
                Pesan Sekarang
              </button>
            </div>

            {/* Quick stats / trust points */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-900 max-w-md">
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">15+</p>
                <p className="text-xs text-zinc-500">Gym Premium</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">2.5k+</p>
                <p className="text-xs text-zinc-500">Rental Terlayani</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">4.9★</p>
                <p className="text-xs text-zinc-500">Rating Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Hero Right Banner Image */}
          <div className="lg:col-span-5 relative h-[380px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800" 
              alt="GymEase Workout" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Premium Experience</span>
              <h3 className="text-lg font-bold text-white font-display">Apex Athletic Club - Senopati</h3>
              <p className="text-xs text-zinc-300">Dilengkapi layanan rental & laundry GymEase.</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950/40 border-y border-zinc-100 dark:border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 dark:text-white">Cara Kerja GymEase</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto">4 langkah mudah untuk berolahraga dengan nyaman tanpa membawa pakaian olahraga kotor Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20 font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Pilih Gym & Paket</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Pilih lokasi gym mitra terdekat dengan kantor Anda beserta paket kunjungan harian atau bulanan.</p>
            </div>
            {/* Step 2 */}
            <div className="p-6 bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Tambah Rental & Laundry</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Sewa kaos, celana pendek, handuk, atau akses loker. Tambahkan laundry kotor langsung saat checkout.</p>
            </div>
            {/* Step 3 */}
            <div className="p-6 bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20 font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Checkout Instan</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Selesaikan pembayaran secara online dengan QRIS, Bank Transfer, atau E-Wallet dalam satu langkah.</p>
            </div>
            {/* Step 4 */}
            <div className="p-6 bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 font-mono">
                04
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Datang & Mulai</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Ambil pakaian bersih di meja resepsionis gym mitra. Selesai latihan, kembalikan saja baju kotor untuk di-laundry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GYMS SECTION (WITH FILTERS & INTERACTIVE MAP SPLIT) */}
      <section id="gyms" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-10">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
                <MapPin className="w-7 h-7 text-emerald-500" />
                <span>Gym Mitra Unggulan</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Temukan gym mitra kami di area perkantoran strategis Anda.</p>
            </div>
            
            {/* Clear Filters Button */}
            {(searchQuery || selectedCity !== 'All' || selectedFacility !== 'All' || selectedRating > 0) && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedFacility('All');
                  setSelectedRating(0);
                  setMaxPrice(2000000);
                }}
                className="text-xs flex items-center gap-1 text-rose-500 hover:underline font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          {/* Dynamic Search & Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari nama gym atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
              />
            </div>

            {/* City Select */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white capitalize appearance-none"
              >
                <option value="All">Semua Kawasan</option>
                <option value="Sudirman">Sudirman</option>
                <option value="Kuningan">Kuningan</option>
                <option value="Senopati">Senopati</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>

            {/* Facilities Select */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white appearance-none"
              >
                <option value="All">Semua Fasilitas</option>
                {allFacilities.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>

            {/* Rating Select */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white appearance-none"
              >
                <option value={0}>Semua Rating</option>
                <option value={4.6}>Rating 4.6+ ★</option>
                <option value={4.8}>Rating 4.8+ ★</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Split Gyms List & Map View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gyms List Grid (Left 7 columns) */}
            <div className="lg:col-span-7 space-y-6 max-h-[700px] overflow-y-auto pr-2">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-44 w-full bg-zinc-100 dark:bg-zinc-900/60 animate-pulse rounded-2xl border border-zinc-200 dark:border-zinc-900" />
                ))
              ) : filteredGyms.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20">
                  <p className="text-zinc-500 text-sm">Gym yang cocok dengan kriteria filter Anda tidak ditemukan.</p>
                </div>
              ) : (
                filteredGyms.map((gym) => (
                  <div 
                    key={gym.id} 
                    className="flex flex-col md:flex-row bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900/80 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-emerald-500/2 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    {/* Gym Picture */}
                    <div className="relative w-full md:w-52 h-44 md:h-auto overflow-hidden">
                      <img 
                        src={gym.gallery?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'} 
                        alt={gym.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-zinc-950/70 border border-zinc-800 text-amber-400 font-bold px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 z-10">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{getGymRating(gym.id)}</span>
                      </div>
                    </div>

                    {/* Gym Info Card */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display group-hover:text-emerald-500 transition-colors">
                            {gym.name}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{gym.address}</span>
                        </p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>Buka: {gym.operating_hours} WIB</span>
                        </p>
                        
                        {/* Facilities tags limit to 3 */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {gym.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-300">
                              {f}
                            </span>
                          ))}
                          {gym.facilities.length > 3 && (
                            <span className="text-[10px] font-medium text-zinc-400 px-1">
                              +{gym.facilities.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detail Footer */}
                      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900/60 pt-3.5">
                        <div>
                          <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">Mulai Dari</span>
                          <span className="text-sm font-extrabold text-emerald-500 dark:text-emerald-400">{getGymStartingPrice(gym.id)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            href={`/gyms/${gym.id}`}
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white transition-colors"
                          >
                            Detail Gym
                          </Link>
                          <button
                            onClick={() => handleBook(gym.id)}
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black shadow-md transition-colors"
                          >
                            Pesan
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Map Split Screen (Right 5 columns) */}
            <div className="lg:col-span-5 h-[500px] lg:h-[650px] sticky top-24 z-10">
              {!loading && (
                <GymMap gyms={filteredGyms} center={filteredGyms.length > 0 ? [filteredGyms[0].latitude, filteredGyms[0].longitude] : [-6.2235, 106.8166]} />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* RENTAL PRODUCTS SECTION */}
      <section id="products" className="py-24 bg-zinc-50 dark:bg-zinc-950/20 border-y border-zinc-100 dark:border-zinc-900 px-6 scroll-mt-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Shirt className="w-3.5 h-3.5" />
              <span>Rental Equipment</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 dark:text-white">Pilihan Perlengkapan Rental</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">Pakaian olahraga dicuci steril dan disetrika uap hangat. Loker digital pintar & handuk segar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900/60 animate-pulse rounded-2xl border border-zinc-200 dark:border-zinc-900" />
              ))
            ) : (
              products.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Photo with category tag */}
                  <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={prod.photo_url} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-zinc-950/70 border border-zinc-800 text-[10px] text-white px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">
                      {prod.category === 'shirt' ? 'Baju Kaos' : prod.category === 'shorts' ? 'Celana' : prod.category === 'towel' ? 'Handuk' : 'Loker'}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5 text-left">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white font-display">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Stok: <span className="font-bold text-zinc-700 dark:text-white">{prod.stock} unit</span></span>
                        {prod.sizes && prod.sizes.length > 0 && (
                          <span className="text-zinc-500">Ukuran: <span className="font-bold text-emerald-400">{prod.sizes.map(s => s.size).join(', ')}</span></span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900/80">
                        <span className="text-lg font-extrabold text-emerald-500">Rp {prod.price.toLocaleString()} <span className="text-[10px] text-zinc-400 font-normal">/sewa</span></span>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section id="packages" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-10">
        <div className="space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Best Membership Plans</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 dark:text-white">Pilihan Paket Kunjungan</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">Kami menyediakan opsi kunjungan fleksibel mulai dari harian hingga bulanan korporat.</p>
          </div>

          {/* Simple grid of packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Daily Pass Mock */}
            <div className="glass bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 p-8 rounded-3xl flex flex-col justify-between relative hover:border-emerald-500/30 transition-all duration-300 text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Daily Entry</span>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Daily Pass</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">Rp 120.000 - 175.000</span>
                  <span className="text-xs text-zinc-500">/kunjungan</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Cocok untuk pekerja yang hanya ingin berolahraga sekali-kali ketika ada waktu senggang setelah pulang kantor.</p>
                <ul className="space-y-2.5 pt-4 text-xs">
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Akses Gym 1 Hari Penuh</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Loker & Shower Room</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Semua peralatan kardio & beban</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link 
                  href="#gyms" 
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white text-xs font-semibold rounded-xl text-center block transition-colors"
                >
                  Pilih Gym Mitra
                </Link>
              </div>
            </div>

            {/* Monthly Pass Mock */}
            <div className="glass bg-zinc-900/50 dark:bg-zinc-900/40 border-2 border-emerald-500/30 p-8 rounded-3xl flex flex-col justify-between relative hover:shadow-emerald-500/2 hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                Terpopuler
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Unlimited Monthly</span>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Monthly Membership</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">Rp 900.000 - 1.500.000</span>
                  <span className="text-xs text-zinc-500">/bulan</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Paket ideal untuk pekerja komitmen penuh yang rutin membakar kalori setiap hari kerja tanpa pusing baju kotor.</p>
                <ul className="space-y-2.5 pt-4 text-xs">
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Akses Gym Tanpa Batas (30 Hari)</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Prioritas Booking Loker & Sportswear</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gratis Kelas Group Workout (Yoga/HIIT)</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Diskon Layanan Laundry Mitra</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link 
                  href="#gyms" 
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-xl text-center block transition-colors shadow-md"
                >
                  Pilih Gym Mitra
                </Link>
              </div>
            </div>

            {/* Corporate Pass Mock */}
            <div className="glass bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 p-8 rounded-3xl flex flex-col justify-between relative hover:border-emerald-500/30 transition-all duration-300 text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Business Solution</span>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Corporate Plan</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">Hubungi Admin</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Paket kebugaran khusus untuk perusahaan yang memprioritaskan kesehatan karyawan kantor. Kontak admin kami.</p>
                <ul className="space-y-2.5 pt-4 text-xs">
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Akses khusus multi-gym mitra</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Layanan penjemputan laundry korporat</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Invoice bulanan terkonsolidasi</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <a 
                  href="mailto:corporate@gymease.com?subject=Tanya%20Corporate%20Plan%20GymEase" 
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white text-xs font-semibold rounded-xl text-center block transition-colors"
                >
                  Kirim Email Kemitraan
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950/40 border-y border-zinc-100 dark:border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 dark:text-white">Ulasan Pengguna Aktif</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">Dengarkan apa kata para pekerja kantoran di Jakarta yang telah terbantu oleh GymEase.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between text-left">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
                "Sangat terbantu! Saya tidak perlu repot membawa tas gym besar berisi baju kotor dan handuk basah ke kantor. Baju sewaan GymEase bersih, pas ukurannya, wangi. Gym Elite Sudirman juga mantap!"
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" 
                  alt="Budi" 
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Budi Santoso</h4>
                  <p className="text-[10px] text-zinc-500">Corporate Banker, SCBD</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between text-left">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
                "Sangat praktis untuk eksekutif yang sibuk. Gym-nya modern, kelas-kelasnya asik, dan rental kaosnya sangat wangi. Laundry service-nya juga cepat. Suka sekali dengan yoga studionya."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" 
                  alt="Siti" 
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Siti Rahma</h4>
                  <p className="text-[10px] text-zinc-500">Consultant, Mega Kuningan</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between text-left">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
                "Saya tidak perlu mencuci baju gym lagi di hari kerja. Dengan layanan laundry GymEase, setelah latihan saya tinggal letakkan baju kotor di resepsionis. Hidup jauh lebih praktis."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150" 
                  alt="Dewi" 
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Dewi Lestari</h4>
                  <p className="text-[10px] text-zinc-500">Software Product Manager, Senopati</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6 scroll-mt-10">
        <div className="space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold font-display text-zinc-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-indigo-400" />
              <span>Pertanyaan yang Sering Diajukan</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Informasi penting mengenai layanan rental, laundry, dan operasional GymEase.</p>
          </div>

          {/* Interactive Accordion */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-100 dark:bg-zinc-900/60 animate-pulse rounded-xl border border-zinc-200 dark:border-zinc-900" />
              ))
            ) : (
              faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="border border-zinc-200/75 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-900/20 overflow-hidden text-left"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-150 focus:outline-none"
                    >
                      <span className="font-bold text-sm leading-relaxed">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-1 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900/60 leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/10">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
