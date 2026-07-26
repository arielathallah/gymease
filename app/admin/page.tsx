'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  BarChart3, Dumbbell, Package, ShoppingBag, CreditCard, Star,
  Settings, Users, Plus, Trash2, Edit, Check, X, Eye,
  MapPin, Clock, DollarSign, Calendar, RefreshCw
} from 'lucide-react';
import { getCurrentUser } from '@/services/user';
import { listGyms, createGym, updateGym, deleteGym, uploadGymImage } from '@/services/gym';
import { listProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/services/product';
import { listPackages, createPackage, updatePackage, deletePackage } from '@/services/package';
import { getAllBookings, updateBookingStatus, updatePaymentStatus } from '@/services/booking';
import { Gym, GymPackage, Product, Booking, Profile } from '@/types';

// Dynamically load the admin map component to bypass SSR
const AdminMap = dynamic(() => import('@/components/AdminMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-900 animate-pulse rounded-xl border border-zinc-800" />
});

export default function AdminDashboard() {
  const router = useRouter();

  // State controls
  const [adminUser, setAdminUser] = useState<Profile | null>(null);
  const [activeMenu, setActiveMenu] = useState<'analytics' | 'gyms' | 'packages' | 'products' | 'bookings'>('analytics');
  const [loading, setLoading] = useState(true);

  // Db State
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals / Form States
  const [showGymModal, setShowGymModal] = useState(false);
  const [editingGymId, setEditingGymId] = useState<string | null>(null);
  const [gymUploadFiles, setGymUploadFiles] = useState<File[]>([]);

  interface GymFormState {
    name: string;
    description: string;
    address: string;
    operating_hours: string;
    latitude: number;
    longitude: number;
    facilities: string;
    status: 'active' | 'inactive';
    galleryImages: string;
  }

  const [gymForm, setGymForm] = useState<GymFormState>({
    name: '', description: '', address: '', operating_hours: '06:00 - 22:00',
    latitude: -6.2235, longitude: 106.8166, facilities: '', status: 'active',
    galleryImages: ''
  });

  interface ProductFormState {
    name: string;
    description: string;
    category: 'shirt' | 'shorts' | 'towel' | 'locker';
    price: number;
    stock: number;
    photo_url: string;
    status: 'active' | 'inactive';
    sizeXS: number;
    sizeS: number;
    sizeM: number;
    sizeL: number;
    sizeXL: number;
    sizeXXL: number;
  }

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productUploadFile, setProductUploadFile] = useState<File | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '', description: '', category: 'shirt', price: 30000,
    stock: 20, photo_url: '', status: 'active',
    // Clothing sizes stock
    sizeXS: 2, sizeS: 4, sizeM: 6, sizeL: 4, sizeXL: 2, sizeXXL: 2
  });

  interface PkgFormState {
    gym_id: string;
    name: string;
    price: number;
    duration: 'daily' | 'weekly' | 'monthly' | 'corporate';
    benefits: string;
  }

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgForm, setPkgForm] = useState<PkgFormState>({
    gym_id: '', name: '', price: 100000, duration: 'daily', benefits: ''
  });

  // Modal for payment receipts review
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'admin') {
        const mockUser = typeof window !== 'undefined' ? window.sessionStorage.getItem('gymease_mock_user') : null;
        if (mockUser) {
          try {
            const parsed = JSON.parse(mockUser) as Profile;
            if (parsed.role === 'admin') {
              setAdminUser(parsed);
              setLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
        router.push('/login?redirectTo=/admin');
        return;
      }
      setAdminUser(user);

      const [loadedGyms, loadedProds, loadedPkgs, loadedBookings] = await Promise.all([
        listGyms(),
        listProducts(),
        listPackages(),
        getAllBookings()
      ]);

      setGyms(loadedGyms);
      setProducts(loadedProds);
      setPackages(loadedPkgs);
      setBookings(loadedBookings);

      if (loadedGyms.length > 0 && !pkgForm.gym_id) {
        setPkgForm(prev => ({ ...prev, gym_id: loadedGyms[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Poll data for new payments/bookings
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Gym Operations
  const handleGymSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const facilityList = gymForm.facilities.split(',').map(f => f.trim()).filter(Boolean);

    try {
      const existingGallery = editingGymId ? gyms.find((g) => g.id === editingGymId)?.gallery || [] : [];
      const galleryList = gymUploadFiles.length > 0
        ? await Promise.all(gymUploadFiles.map((file) => uploadGymImage(file)))
        : existingGallery;

      if (editingGymId) {
        await updateGym(editingGymId, {
          name: gymForm.name,
          description: gymForm.description,
          address: gymForm.address,
          operating_hours: gymForm.operating_hours,
          latitude: gymForm.latitude,
          longitude: gymForm.longitude,
          facilities: facilityList,
          status: gymForm.status
        }, galleryList);
      } else {
        await createGym({
          name: gymForm.name,
          description: gymForm.description,
          address: gymForm.address,
          operating_hours: gymForm.operating_hours,
          latitude: gymForm.latitude,
          longitude: gymForm.longitude,
          facilities: facilityList,
          status: gymForm.status
        }, galleryList);
      }

      setShowGymModal(false);
      setEditingGymId(null);
      setGymUploadFiles([]);
      setGymForm({
        name: '', description: '', address: '', operating_hours: '06:00 - 22:00',
        latitude: -6.2235, longitude: 106.8166, facilities: '', status: 'active', galleryImages: ''
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditGym = (gym: Gym) => {
    setEditingGymId(gym.id);
    setGymUploadFiles([]);
    setGymForm({
      name: gym.name,
      description: gym.description,
      address: gym.address,
      operating_hours: gym.operating_hours,
      latitude: gym.latitude,
      longitude: gym.longitude,
      facilities: gym.facilities.join(', '),
      status: gym.status,
      galleryImages: gym.gallery?.join('\n') || ''
    });
    setShowGymModal(true);
  };

  const handleDeleteGym = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus gym mitra ini? Seluruh paket juga akan terhapus.')) {
      await deleteGym(id);
      await fetchAdminData();
    }
  };

  // CRUD Product Operations
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = [
      { size: 'XS' as const, stock: productForm.sizeXS },
      { size: 'S' as const, stock: productForm.sizeS },
      { size: 'M' as const, stock: productForm.sizeM },
      { size: 'L' as const, stock: productForm.sizeL },
      { size: 'XL' as const, stock: productForm.sizeXL },
      { size: 'XXL' as const, stock: productForm.sizeXXL }
    ];

    const categoryText = productForm.category;
    const isClothing = categoryText === 'shirt' || categoryText === 'shorts';
    const totalStock = isClothing ? sizes.reduce((sum, s) => sum + s.stock, 0) : productForm.stock;

    try {
      const currentPhotoUrl = editingProductId ? products.find((p) => p.id === editingProductId)?.photo_url || '' : '';
      const photoUrl = productUploadFile
        ? await uploadProductImage(productUploadFile)
        : currentPhotoUrl || productForm.photo_url || '';

      if (editingProductId) {
        await updateProduct(editingProductId, {
          name: productForm.name,
          description: productForm.description,
          category: productForm.category,
          price: productForm.price,
          stock: totalStock,
          photo_url: photoUrl,
          status: productForm.status
        }, isClothing ? sizes : []);
      } else {
        await createProduct(
          {
            name: productForm.name,
            description: productForm.description,
            category: productForm.category,
            price: productForm.price,
            stock: totalStock,
            photo_url: photoUrl,
            status: productForm.status
          },
          isClothing ? sizes : []
        );
      }

      setShowProductModal(false);
      setEditingProductId(null);
      setProductUploadFile(null);
      setProductForm({
        name: '', description: '', category: 'shirt', price: 30000, stock: 20, photo_url: '', status: 'active',
        sizeXS: 2, sizeS: 4, sizeM: 6, sizeL: 4, sizeXL: 2, sizeXXL: 2
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductUploadFile(null);
    const sizeMap: Record<string, number> = {};
    prod.sizes?.forEach(s => {
      sizeMap[s.size] = s.stock;
    });

    setProductForm({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      photo_url: prod.photo_url,
      status: prod.status,
      sizeXS: sizeMap['XS'] || 0,
      sizeS: sizeMap['S'] || 0,
      sizeM: sizeMap['M'] || 0,
      sizeL: sizeMap['L'] || 0,
      sizeXL: sizeMap['XL'] || 0,
      sizeXXL: sizeMap['XXL'] || 0
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk sewaan ini?')) {
      await deleteProduct(id);
      await fetchAdminData();
    }
  };

  // CRUD Package Operations
  const handlePkgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefitList = pkgForm.benefits.split(',').map(b => b.trim()).filter(Boolean);

    try {
      if (editingPkgId) {
        await updatePackage(editingPkgId, {
          gym_id: pkgForm.gym_id,
          name: pkgForm.name,
          price: pkgForm.price,
          duration: pkgForm.duration,
          benefits: benefitList
        });
      } else {
        await createPackage({
          gym_id: pkgForm.gym_id,
          name: pkgForm.name,
          price: pkgForm.price,
          duration: pkgForm.duration,
          benefits: benefitList
        });
      }

      setShowPkgModal(false);
      setEditingPkgId(null);
      setPkgForm({
        gym_id: gyms[0]?.id || '', name: '', price: 100000, duration: 'daily', benefits: ''
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPkg = (pkg: GymPackage) => {
    setEditingPkgId(pkg.id);
    setPkgForm({
      gym_id: pkg.gym_id,
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      benefits: pkg.benefits.join(', ')
    });
    setShowPkgModal(true);
  };

  const handleDeletePkg = async (id: string) => {
    if (confirm('Hapus paket ini?')) {
      await deletePackage(id);
      await fetchAdminData();
    }
  };

  // Booking & Payment validations
  const handleApprovePayment = async (booking: Booking) => {
    if (booking.payment?.id) {
      await updatePaymentStatus(booking.payment.id, 'paid');
      await fetchAdminData();
    }
  };

  const handleRejectPayment = async (booking: Booking) => {
    if (booking.payment?.id) {
      await updatePaymentStatus(booking.payment.id, 'rejected');
      await fetchAdminData();
    }
  };

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    await updateBookingStatus(bookingId, status);
    await fetchAdminData();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Menyiapkan Admin Panel...</p>
      </div>
    );
  }

  if (!adminUser) return null;

  // Global counts for metrics
  const totalRevenue = bookings
    .filter(b => b.payment?.status === 'paid')
    .reduce((sum, b) => sum + Number(b.grand_total), 0);
  const activeCustomersCount = 3 + new Set(bookings.map(b => b.user_id)).size; // 3 mock base customers + unique bookings

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-left">

      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-900 p-6 flex flex-col justify-between gap-8 shrink-0">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-white font-bold text-lg border-b border-zinc-900 pb-4 w-full">
            <div className="p-2 bg-indigo-500 rounded-xl text-black">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span>Admin Panel</span>
          </div>

          <nav className="space-y-1.5 flex flex-col text-xs font-semibold">
            <button
              onClick={() => setActiveMenu('analytics')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${activeMenu === 'analytics' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-900 hover:text-white'
                }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>Analitik Dashboard</span>
            </button>

            <button
              onClick={() => setActiveMenu('gyms')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${activeMenu === 'gyms' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-900 hover:text-white'
                }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              <span>Mitra Gym ({gyms.length})</span>
            </button>

            <button
              onClick={() => setActiveMenu('packages')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${activeMenu === 'packages' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-900 hover:text-white'
                }`}
            >
              <Package className="w-4.5 h-4.5" />
              <span>Paket Membership</span>
            </button>

            <button
              onClick={() => setActiveMenu('products')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${activeMenu === 'products' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-900 hover:text-white'
                }`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Stok Rental Pakaian</span>
            </button>

            <button
              onClick={() => setActiveMenu('bookings')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${activeMenu === 'bookings' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-900 hover:text-white'
                }`}
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>Pemesanan & Pembayaran</span>
              {bookings.filter(b => b.payment?.status === 'pending').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-auto" />
              )}
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-600 font-mono">
          <span>Logged in: {adminUser.full_name}</span>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-6 lg:p-10 space-y-8 bg-zinc-50 dark:bg-[#030303]">

        {/* Menu View: Analytics Dashboard */}
        {activeMenu === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">Analitik Platform GymEase</h2>

            {/* Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Pendapatan Bersih</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">Rp {totalRevenue.toLocaleString()}</span>
                <span className="text-[9px] text-zinc-500 mt-1 block">* Dari transfer terverifikasi</span>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Total Booking Masuk</span>
                <span className="text-xl font-black text-white mt-1 block">{bookings.length} Transaksi</span>
                <span className="text-[9px] text-zinc-500 mt-1 block">{bookings.filter(b => b.status === 'completed').length} kunjungan selesai</span>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Pelanggan Aktif</span>
                <span className="text-xl font-black text-white mt-1 block">{activeCustomersCount} Orang</span>
                <span className="text-[9px] text-zinc-500 mt-1 block">Meningkat 20% bulan ini</span>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Produk Terlaris</span>
                <span className="text-xl font-black text-indigo-400 mt-1 block">Dry-Fit Shirt</span>
                <span className="text-[9px] text-zinc-500 mt-1 block">Disewa 120 kali</span>
              </div>

            </div>

            {/* Custom Responsive SVG Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Monthly Revenue Chart */}
              <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Perkembangan Pendapatan (Bulan Ini)</h3>

                <div className="h-64 flex items-end justify-between pt-6 font-mono text-[9px] text-zinc-500">
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-emerald-500/10 rounded-t-lg relative flex justify-center" style={{ height: '80px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-emerald-400">Rp 1.2M</span>
                      <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg" style={{ height: '30px' }} />
                    </div>
                    <span>Minggu 1</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-emerald-500/10 rounded-t-lg relative flex justify-center" style={{ height: '80px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-emerald-400">Rp 2.4M</span>
                      <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg" style={{ height: '50px' }} />
                    </div>
                    <span>Minggu 2</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-emerald-500/10 rounded-t-lg relative flex justify-center" style={{ height: '80px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-emerald-400">Rp 3.1M</span>
                      <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg" style={{ height: '62px' }} />
                    </div>
                    <span>Minggu 3</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-emerald-500/10 rounded-t-lg relative flex justify-center" style={{ height: '80px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-emerald-400">Rp 4.5M</span>
                      <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg" style={{ height: '80px' }} />
                    </div>
                    <span>Minggu 4</span>
                  </div>
                </div>
              </div>

              {/* Monthly Bookings Chart */}
              <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Perkembangan Transaksi Kunjungan</h3>

                <div className="h-64 flex items-end justify-between pt-6 font-mono text-[9px] text-zinc-500">
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-indigo-500/10 rounded-t-lg relative flex justify-center" style={{ height: '100px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-indigo-400">8</span>
                      <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: '35px' }} />
                    </div>
                    <span>Minggu 1</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-indigo-500/10 rounded-t-lg relative flex justify-center" style={{ height: '100px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-indigo-400">14</span>
                      <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: '60px' }} />
                    </div>
                    <span>Minggu 2</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-indigo-500/10 rounded-t-lg relative flex justify-center" style={{ height: '100px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-indigo-400">19</span>
                      <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: '78px' }} />
                    </div>
                    <span>Minggu 3</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-indigo-500/10 rounded-t-lg relative flex justify-center" style={{ height: '100px' }}>
                      <span className="absolute -top-5 text-[8px] font-bold text-indigo-400">25</span>
                      <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: '100px' }} />
                    </div>
                    <span>Minggu 4</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Menu View: Gyms Management */}
        {activeMenu === 'gyms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">Kelola Mitra Gym</h2>
              <button
                onClick={() => {
                  setEditingGymId(null);
                  setGymForm({
                    name: '', description: '', address: '', operating_hours: '06:00 - 22:00',
                    latitude: -6.2235, longitude: 106.8166, facilities: '', status: 'active', galleryImages: ''
                  });
                  setShowGymModal(true);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Gym Baru</span>
              </button>
            </div>

            {/* Gyms Table List */}
            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 font-bold uppercase">
                      <th className="p-4 text-left">Nama Gym</th>
                      <th className="p-4 text-left">Alamat</th>
                      <th className="p-4 text-left">Operasional</th>
                      <th className="p-4 text-left">Fasilitas</th>
                      <th className="p-4 text-left">Koordinat</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {gyms.map((gym) => (
                      <tr key={gym.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20">
                        <td className="p-4 font-bold text-zinc-900 dark:text-white">{gym.name}</td>
                        <td className="p-4 text-zinc-500 truncate max-w-xs">{gym.address}</td>
                        <td className="p-4 text-zinc-500">{gym.operating_hours}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {gym.facilities.map(f => (
                              <span key={f} className="bg-zinc-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded text-zinc-400">
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400 font-mono text-[10px]">{gym.latitude}, {gym.longitude}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditGym(gym)}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGym(gym.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gym Form Modal */}
            {showGymModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 w-full max-w-3xl rounded-3xl p-6 shadow-2xl relative space-y-6">

                  <button
                    onClick={() => setShowGymModal(false)}
                    className="absolute top-4 right-4 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-base font-bold font-display text-zinc-900 dark:text-white">
                    {editingGymId ? 'Edit Gym Mitra' : 'Tambah Gym Mitra Baru'}
                  </h3>

                  <form onSubmit={handleGymSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                    {/* Left Form Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Nama Gym</label>
                        <input
                          type="text"
                          value={gymForm.name}
                          onChange={(e) => setGymForm({ ...gymForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Alamat Lengkap</label>
                        <input
                          type="text"
                          value={gymForm.address}
                          onChange={(e) => setGymForm({ ...gymForm, address: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Deskripsi</label>
                        <textarea
                          value={gymForm.description}
                          onChange={(e) => setGymForm({ ...gymForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-400">Latitude</label>
                          <input
                            type="number"
                            step="0.000001"
                            value={gymForm.latitude}
                            onChange={(e) => setGymForm({ ...gymForm, latitude: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-400">Longitude</label>
                          <input
                            type="number"
                            step="0.000001"
                            value={gymForm.longitude}
                            onChange={(e) => setGymForm({ ...gymForm, longitude: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Fasilitas (pisahkan dengan koma)</label>
                        <input
                          type="text"
                          placeholder="Sauna, WiFi, Studio Yoga"
                          value={gymForm.facilities}
                          onChange={(e) => setGymForm({ ...gymForm, facilities: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Right Map Selector */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-1 flex-grow">
                        <label className="text-[9px] uppercase font-bold text-zinc-400 block mb-1">Pilih Posisi Peta Koordinat</label>
                        <div className="h-60 w-full rounded-xl overflow-hidden border border-zinc-800 relative">
                          <AdminMap
                            latitude={gymForm.latitude}
                            longitude={gymForm.longitude}
                            onChange={(lat, lng) => setGymForm(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Pilih Foto Gallery (File)</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setGymUploadFiles(Array.from(e.target.files || []))}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                        />
                        {gymUploadFiles.length > 0 && (
                          <p className="text-[10px] text-zinc-500">Terpilih {gymUploadFiles.length} file</p>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowGymModal(false)}
                          className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-900"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-white shadow-lg"
                        >
                          Simpan Gym
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu View: Package Management */}
        {activeMenu === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">Kelola Paket Gym Mitra</h2>
              <button
                onClick={() => {
                  setEditingPkgId(null);
                  setPkgForm({
                    gym_id: gyms[0]?.id || '', name: '', price: 150000, duration: 'daily', benefits: ''
                  });
                  setShowPkgModal(true);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Paket Baru</span>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 font-bold uppercase">
                      <th className="p-4 text-left">Nama Paket</th>
                      <th className="p-4 text-left">Mitra Gym</th>
                      <th className="p-4 text-left">Durasi</th>
                      <th className="p-4 text-left">Harga</th>
                      <th className="p-4 text-left">Benefit</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {packages.map((pkg) => {
                      const gym = gyms.find(g => g.id === pkg.gym_id);
                      return (
                        <tr key={pkg.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20">
                          <td className="p-4 font-bold text-zinc-900 dark:text-white">{pkg.name}</td>
                          <td className="p-4 text-zinc-500 font-medium">{gym?.name || 'Partner Gym'}</td>
                          <td className="p-4 text-zinc-500 capitalize">{pkg.duration}</td>
                          <td className="p-4 font-bold text-emerald-400">Rp {pkg.price.toLocaleString()}</td>
                          <td className="p-4">
                            <ul className="list-disc pl-4 text-zinc-400 space-y-0.5">
                              {pkg.benefits.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditPkg(pkg)}
                                className="p-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePkg(pkg.id)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package Modal Form */}
            {showPkgModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
                  <button
                    onClick={() => setShowPkgModal(false)}
                    className="absolute top-4 right-4 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-white">
                    {editingPkgId ? 'Edit Paket Kunjungan' : 'Tambah Paket Kunjungan Baru'}
                  </h3>

                  <form onSubmit={handlePkgSubmit} className="space-y-4 text-xs text-left">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Pilih Gym Mitra</label>
                      <select
                        value={pkgForm.gym_id}
                        onChange={(e) => setPkgForm({ ...pkgForm, gym_id: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                        required
                      >
                        {gyms.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Nama Paket</label>
                      <input
                        type="text"
                        value={pkgForm.name}
                        onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Harga (Rupiah)</label>
                        <input
                          type="number"
                          value={pkgForm.price}
                          onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Durasi</label>
                        <select
                          value={pkgForm.duration}
                          onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value as PkgFormState['duration'] })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                        >
                          <option value="daily">Harian</option>
                          <option value="weekly">Mingguan</option>
                          <option value="monthly">Bulanan</option>
                          <option value="corporate">Korporat</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Benefit (pisahkan dengan koma)</label>
                      <textarea
                        placeholder="Akses Kolam Renang, Sauna harian, Free Wifi"
                        value={pkgForm.benefits}
                        onChange={(e) => setPkgForm({ ...pkgForm, benefits: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowPkgModal(false)}
                        className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-900"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold"
                      >
                        Simpan Paket
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu View: Product Stock Management */}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">Kelola Perlengkapan Rental</h2>
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    name: '', description: '', category: 'shirt', price: 35000, stock: 50, photo_url: '', status: 'active',
                    sizeXS: 5, sizeS: 10, sizeM: 15, sizeL: 12, sizeXL: 6, sizeXXL: 2
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 font-bold uppercase">
                      <th className="p-4 text-left">Foto</th>
                      <th className="p-4 text-left">Nama Produk</th>
                      <th className="p-4 text-left">Kategori</th>
                      <th className="p-4 text-left">Harga Rental</th>
                      <th className="p-4 text-left">Sisa Stok</th>
                      <th className="p-4 text-left">Distribusi Ukuran</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20">
                        <td className="p-4">
                          <img src={prod.photo_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-zinc-800" />
                        </td>
                        <td className="p-4 font-bold text-zinc-900 dark:text-white">{prod.name}</td>
                        <td className="p-4 text-zinc-500 capitalize">{prod.category}</td>
                        <td className="p-4 font-bold text-emerald-400">Rp {prod.price.toLocaleString()}</td>
                        <td className="p-4 text-zinc-400">{prod.stock} unit</td>
                        <td className="p-4 font-mono text-[10px] text-zinc-500">
                          {prod.sizes && prod.sizes.length > 0 ? (
                            <div className="flex gap-2">
                              {prod.sizes.map(s => (
                                <span key={s.id} className="bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 rounded">
                                  {s.size}: <span className="font-bold text-indigo-400">{s.stock}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="italic text-zinc-600">Tidak ada ukuran (Satu ukuran/Universal)</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Modal Form */}
            {showProductModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="absolute top-4 right-4 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-white">
                    {editingProductId ? 'Edit Perlengkapan Rental' : 'Tambah Perlengkapan Baru'}
                  </h3>

                  <form onSubmit={handleProductSubmit} className="space-y-4 text-xs text-left">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Nama Produk</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Kategori</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                        >
                          <option value="shirt">Kaos Baju (Shirt)</option>
                          <option value="shorts">Celana Pendek (Shorts)</option>
                          <option value="towel">Handuk (Towel)</option>
                          <option value="locker">Loker Pintar (Locker)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Biaya Sewa (Rupiah)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Conditional rendering for sizes config if is shirt or shorts */}
                    {['shirt', 'shorts'].includes(productForm.category) ? (
                      <div className="space-y-2 border-t border-b border-zinc-100 dark:border-zinc-900 py-3">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block mb-1">Stok Berdasarkan Ukuran Pakaian</span>
                        <div className="grid grid-cols-6 gap-2">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => {
                            const key = `size${sz}` as 'sizeXS' | 'sizeS' | 'sizeM' | 'sizeL' | 'sizeXL' | 'sizeXXL';
                            return (
                              <div key={sz} className="text-center">
                                <label className="block font-bold text-[10px] text-zinc-500 mb-0.5">{sz}</label>
                                <input
                                  type="number"
                                  value={productForm[key]}
                                  onChange={(e) => setProductForm({ ...productForm, [key]: Number(e.target.value) })}
                                  className="w-full px-1 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center font-bold text-xs"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Total Stok Tersedia</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Deskripsi Perlengkapan</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-400">Foto Produk (File)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProductUploadFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                      />
                      {productUploadFile ? (
                        <p className="text-[10px] text-zinc-500">Terpilih: {productUploadFile.name}</p>
                      ) : (
                        <p className="text-[10px] text-zinc-500">Biarkan kosong jika ingin memakai foto lama.</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowProductModal(false)}
                        className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-900"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold"
                      >
                        Simpan Produk
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu View: Booking & Payment Verifier */}
        {activeMenu === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">Daftar Transaksi Pemesanan</h2>

            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 font-bold uppercase">
                      <th className="p-4 text-left">Pelanggan</th>
                      <th className="p-4 text-left">Gym & Paket</th>
                      <th className="p-4 text-left">Tanggal / Waktu</th>
                      <th className="p-4 text-left">Tagihan</th>
                      <th className="p-4 text-left">Bukti Pembayaran</th>
                      <th className="p-4 text-left">Status Booking</th>
                      <th className="p-4 text-center">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20">
                        <td className="p-4 font-bold text-zinc-900 dark:text-white">{b.user_name || 'Budi Santoso'}</td>
                        <td className="p-4 text-zinc-500">
                          <span className="font-semibold block text-zinc-800 dark:text-zinc-200">{b.gym_name}</span>
                          <span className="text-[10px] text-zinc-400 block">{b.package_name}</span>
                        </td>
                        <td className="p-4 text-zinc-500">
                          <span className="block">{b.booking_date}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{b.booking_time} WIB</span>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-emerald-400 block">Rp {b.grand_total.toLocaleString()}</span>
                          <span className="text-[9px] uppercase font-bold text-zinc-500">{b.payment?.payment_method}</span>
                        </td>
                        <td className="p-4">
                          {b.payment?.payment_proof_url ? (
                            <button
                              onClick={() => setActiveReceiptUrl(b.payment?.payment_proof_url || null)}
                              className="px-2.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20 rounded-lg flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Bukti</span>
                            </button>
                          ) : (
                            <span className="text-zinc-600 italic">Belum diunggah</span>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="workout">Workout</option>
                            <option value="laundry">Laundry</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          {b.payment?.status === 'pending' ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleApprovePayment(b)}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Terima</span>
                              </button>
                              <button
                                onClick={() => handleRejectPayment(b)}
                                className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${b.payment?.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                              {b.payment?.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for previewing receipts */}
            {activeReceiptUrl && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="relative max-w-lg w-full max-h-[85vh] bg-zinc-950 border border-zinc-900 rounded-3xl p-5 flex flex-col items-center">
                  <button
                    onClick={() => setActiveReceiptUrl(null)}
                    className="absolute top-4 right-4 p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Pratinjau Bukti Pembayaran</h4>
                  <img
                    src={activeReceiptUrl}
                    alt="Receipt payment proof detail"
                    className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-zinc-900"
                  />
                  <div className="mt-4 text-[10px] text-zinc-500 leading-normal">
                    * Verifikasi kecocokan nomor transaksi atau mutasi rekening sebelum menyetujui.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
