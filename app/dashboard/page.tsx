'use client';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Dumbbell, User, Bell, Settings, ShoppingBag,
  CheckCircle, ShieldAlert, Sparkles, Compass, AlertCircle,
  MapPin, Check, QrCode, RefreshCw
} from 'lucide-react';
import { getCurrentUser, updateProfile } from '@/services/user';
import { getBookingsByUserId, submitPaymentProof } from '@/services/booking';
import { listNotificationsByUserId } from '@/services/notification';
import { Booking, Notification, Profile } from '@/types';

export default function CustomerDashboard() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'notifications' | 'profile'>('bookings');

  // Edit profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // File upload for individual receipt update
  const [selectedBookingIdForProof, setSelectedBookingIdForProof] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role !== 'customer') {
        router.push('/login?redirectTo=/dashboard');
        return;
      }

      setUser(currentUser);
      setFullName(currentUser.full_name || '');
      setPhone(currentUser.phone || '');
      setAvatarUrl(currentUser.avatar_url || '');

      const [userBookings, userNotifs] = await Promise.all([
        getBookingsByUserId(currentUser.id),
        listNotificationsByUserId(currentUser.id)
      ]);

      setBookings(userBookings);
      setNotifications(userNotifs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll data for admin confirmations
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdatingProfile(true);
    setUpdateMsg('');

    try {
      const updated = await updateProfile(user.id, {
        full_name: fullName,
        phone,
        avatar_url: avatarUrl
      });
      if (updated) {
        setUser(updated);
        setUpdateMsg('Profil berhasil diperbarui!');
      }
    } catch (err) {
      console.error(err);
      setUpdateMsg('Gagal memperbarui profil.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUploadProof = async (bookingId: string) => {
    if (!proofFile) return;
    setUploadingProof(true);
    try {
      await submitPaymentProof(bookingId, proofFile);
      setProofFile(null);
      setSelectedBookingIdForProof(null);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingProof(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Memuat dashboard Anda...</p>
      </div>
    );
  }

  if (!user) return null;

  // Active metrics
  const activeBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const finishedWorkouts = bookings.filter(b => b.status === 'completed').length;

  // Find current laundry items
  const activeLaundryBookings = bookings.filter(b => b.laundry_option && b.status !== 'completed' && b.status !== 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Top Welcome Banner */}
      <div className="relative p-6 md:p-8 bg-zinc-900/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="absolute top-0 right-0 w-80 h-80 glow-bg rounded-full pointer-events-none z-0" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'}
            alt={user.full_name || 'User Avatar'}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
          />
          <div>
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Customer Elite</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Selamat datang kembali, {user.full_name}!</h2>
            <p className="text-xs text-zinc-500">Mulai gaya hidup sehat Anda tanpa ribet bersama GymEase.</p>
          </div>
        </div>

        <div className="flex gap-4 text-center relative z-10 shrink-0">
          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl min-w-[90px]">
            <span className="text-2xl font-extrabold text-white block">{activeBookings.length}</span>
            <span className="text-[10px] text-zinc-500 font-medium">Jadwal Aktif</span>
          </div>
          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl min-w-[90px]">
            <span className="text-2xl font-extrabold text-emerald-500 block">{finishedWorkouts}</span>
            <span className="text-[10px] text-zinc-500 font-medium">Selesai Gym</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 text-left">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'bookings'
              ? 'border-emerald-500 text-emerald-500'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal & Riwayat Booking</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer relative ${activeTab === 'notifications'
              ? 'border-emerald-500 text-emerald-500'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifikasi Saya</span>
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span className="absolute top-2.5 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'profile'
              ? 'border-emerald-500 text-emerald-500'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Profil</span>
        </button>
      </div>

      {/* Dashboard Views */}
      <div className="grid grid-cols-1 gap-8 text-left">

        {/* Tab 1: Bookings & Laundry Stepper */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">

            {/* Laundry Tracker section if there are active laundry rentals */}
            {activeLaundryBookings.length > 0 && (
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">Status Laundry Aktif</h3>
                </div>

                {activeLaundryBookings.map((b) => {
                  // status check
                  const bookingStatus = b.status;
                  const isCheckedIn = ['checked_in', 'workout', 'laundry', 'completed'].includes(bookingStatus);
                  const isWorkoutDone = ['workout', 'laundry', 'completed'].includes(bookingStatus);
                  const isLaundryDone = ['completed'].includes(bookingStatus);

                  return (
                    <div key={b.id} className="p-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-300">Pemesanan di {b.gym_name}</span>
                        <span className="text-[10px] text-zinc-500">Tanggal: {b.booking_date}</span>
                      </div>

                      {/* Stepper Progress Bar */}
                      <div className="relative pt-4 pb-2">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 z-0" />
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width: isLaundryDone ? '100%' : isWorkoutDone ? '66%' : isCheckedIn ? '33%' : '0%'
                          }}
                        />

                        <div className="flex justify-between relative z-10">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isCheckedIn ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                              1
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Check-in</span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isWorkoutDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                              2
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Olahraga</span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${bookingStatus === 'laundry' || isLaundryDone ? 'bg-emerald-500 border-emerald-500 text-black animate-pulse' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                              3
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Mulai Laundry</span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isLaundryDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                              4
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Selesai</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-400 text-center pt-1 font-mono italic">
                        {bookingStatus === 'pending' || bookingStatus === 'confirmed' && '* Menunggu kedatangan Anda di gym untuk memulai penyewaan & laundry.'}
                        {bookingStatus === 'checked_in' && '* Anda telah check-in. Baju sewaan sedang Anda gunakan untuk latihan.'}
                        {bookingStatus === 'workout' && '* Anda sedang berolahraga. Letakkan baju di keranjang pengembalian setelah selesai.'}
                        {bookingStatus === 'laundry' && '* Pakaian kotor telah dikembalikan. Pakaian sedang dicuci steril dan disetrika uap.'}
                        {bookingStatus === 'completed' && '* Proses laundry selesai! Baju siap digunakan kembali pada jadwal Anda berikutnya.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bookings List Cards */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Riwayat Pemesanan Anda</h3>

              {bookings.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl bg-zinc-50 dark:bg-zinc-950/20 space-y-4">
                  <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
                  <p className="text-zinc-500 text-sm">Anda belum memiliki jadwal pemesanan.</p>
                  <Link href="/#gyms" className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs hover:underline">
                    <Compass className="w-4 h-4" />
                    <span>Jelajahi Gym Mitra Sekarang</span>
                  </Link>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl flex flex-col md:flex-row justify-between gap-6"
                  >
                    {/* Booking Details */}
                    <div className="space-y-4 flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white text-base">{b.gym_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              b.status === 'completed' ? 'bg-zinc-800 text-zinc-400' :
                                'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block">Jadwal Kunjungan</span>
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{b.booking_date}</span>
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block">Perkiraan Jam</span>
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{b.booking_time} WIB</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-xs">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Paket Kunjungan</span>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">{b.package_name}</p>
                      </div>

                      {/* Items & Laundry summaries */}
                      <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500">
                        {b.items && b.items.length > 0 && (
                          <div>
                            <span className="font-bold text-zinc-600 dark:text-zinc-400">Sewa: </span>
                            <span>{b.items.map(item => `${item.product_name || 'Produk'} ${item.size ? `(${item.size})` : ''}`).join(', ')}</span>
                          </div>
                        )}
                        {b.laundry_option && (
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>+ Laundry Service</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code / Payment Verification Box */}
                    <div className="w-full md:w-56 p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-150 dark:border-zinc-900/80 flex flex-col items-center justify-between text-center gap-4">

                      {b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'workout' || b.status === 'laundry' ? (
                        // Show check in QR code
                        <div className="space-y-2 flex flex-col items-center justify-center h-full">
                          <QrCode className="w-24 h-24 text-zinc-900 dark:text-white" />
                          <span className="text-[10px] text-zinc-500 leading-snug">Tunjukkan QR Code di atas ke resepsionis untuk Check-In.</span>
                        </div>
                      ) : b.payment?.status === 'pending' ? (
                        // Show pending validation message
                        <div className="space-y-2 py-4 flex flex-col items-center justify-center text-center h-full">
                          <AlertCircle className="w-8 h-8 text-amber-500 animate-pulse" />
                          <h4 className="font-bold text-xs text-amber-500">Pembayaran Ditinjau</h4>
                          <span className="text-[9px] text-zinc-500 leading-normal">Admin sedang mencocokkan bukti transfer. Hubungi admin jika ada kendala.</span>
                        </div>
                      ) : b.payment?.status === 'rejected' ? (
                        // Re-upload proof modules
                        <div className="space-y-2 w-full text-center">
                          <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
                          <h4 className="font-bold text-xs text-rose-500">Bukti Ditolak</h4>

                          {selectedBookingIdForProof === b.id ? (
                            <div className="space-y-2 pt-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) setProofFile(e.target.files[0]);
                                }}
                                className="text-[9px] w-full text-zinc-400 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800"
                              />
                              <button
                                type="button"
                                onClick={() => handleUploadProof(b.id)}
                                disabled={uploadingProof || !proofFile}
                                className="w-full py-1.5 bg-emerald-500 text-black text-[10px] font-bold rounded-lg disabled:opacity-50"
                              >
                                {uploadingProof ? 'Mengirim...' : 'Kirim Ulang'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedBookingIdForProof(b.id)}
                              className="w-full py-1.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg"
                            >
                              Unggah Bukti Baru
                            </button>
                          )}
                        </div>
                      ) : (
                        // Standard payment detail box
                        <div className="space-y-2 w-full py-2">
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block">Total Pembayaran</span>
                          <span className="text-base font-extrabold text-emerald-500 block">Rp {b.grand_total.toLocaleString()}</span>
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider pt-2 border-t border-zinc-100 dark:border-zinc-900">
                            Metode: {b.payment?.payment_method?.toUpperCase()}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Notifikasi Akun Anda</h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {notifications.length === 0 ? (
                <p className="text-zinc-500 text-xs italic py-4">Belum ada notifikasi baru.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="py-4 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${!n.is_read ? 'text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-zinc-500">{new Date(n.created_at).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Pengaturan Profil Pengguna</h3>

            {updateMsg && (
              <p className="text-xs text-emerald-400 font-semibold">{updateMsg}</p>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold block">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold block">Nomor Telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold block">URL Foto Profil (Avatar)</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                />
                <span className="text-[9px] text-zinc-500 block leading-normal">* Masukkan tautan foto web (unsplash dll) untuk profil demonstrasi Anda.</span>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {updatingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
