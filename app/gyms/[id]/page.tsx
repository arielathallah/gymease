'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Star, MapPin, Clock, ArrowLeft, CheckCircle2, ChevronRight,
  MessageSquare, ShieldCheck, Sparkles, Send
} from 'lucide-react';
import { getGymById } from '@/services/gym';
import { listPackagesByGymId } from '@/services/package';
import { listReviewsByGymId, createReview } from '@/services/review';
import { getCurrentUser } from '@/services/user';
import { Gym, GymPackage, Review, Profile } from '@/types';

const GymMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-900">
      <span className="text-sm text-zinc-500">Memuat peta...</span>
    </div>
  )
});

interface GymDetailPageProps {
  params: { id: string };
}

export default function GymDetailPage({ params }: GymDetailPageProps) {

  const router = useRouter();
  const gymId = params.id;

  const [gym, setGym] = useState<Gym | null>(null);
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking selection
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  // Submit Review state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<string>('');

  useEffect(() => {
    async function loadGymData() {
      try {
        const [loadedGym, loadedPkgs, loadedReviews, loadedUser] = await Promise.all([
          getGymById(gymId),
          listPackagesByGymId(gymId),
          listReviewsByGymId(gymId),
          getCurrentUser()
        ]);

        if (!loadedGym) {
          router.push('/');
          return;
        }

        setGym(loadedGym);
        setPackages(loadedPkgs);
        setReviews(loadedReviews);
        setUser(loadedUser);

        if (loadedPkgs.length > 0) {
          setSelectedPackageId(loadedPkgs[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGymData();
  }, [gymId]);

  const handleBook = () => {
    if (!gym || !selectedPackageId) return;

    const checkoutUrl = `/checkout?gymId=${gym.id}&packageId=${selectedPackageId}`;
    if (user) {
      router.push(checkoutUrl);
    } else {
      router.push(`/login?redirectTo=${encodeURIComponent(checkoutUrl)}`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !gym) return;

    setSubmittingReview(true);
    setReviewMessage('');

    try {
      await createReview({
        user_id: user.id,
        gym_id: gym.id,
        rating: newRating,
        comment: newComment
      });

      // Reload reviews
      const updatedReviews = await listReviewsByGymId(gym.id);
      setReviews(updatedReviews);

      setNewComment('');
      setReviewMessage('Ulasan Anda berhasil dikirim!');
    } catch (err) {
      setReviewMessage('Gagal mengirimkan ulasan.');
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-8 animate-pulse text-left">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-96 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-80 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!gym) return null;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const selectedPackage = packages.find(p => p.id === selectedPackageId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Back Button */}
      <div className="flex items-center justify-between text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-xs text-zinc-400 font-mono">ID: {gym.id}</span>
      </div>

      {/* Gallery Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-lg h-[350px] md:h-[450px]">
        {/* Main large image */}
        <div className="md:col-span-2 relative h-full">
          <img
            src={gym.gallery?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'}
            alt="Gym main preview"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Secondary grid */}
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="h-1/2 relative overflow-hidden">
            <img
              src={gym.gallery?.[1] || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800'}
              alt="Gym secondary 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-1/2 relative overflow-hidden">
            <img
              src={gym.gallery?.[2] || 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800'}
              alt="Gym secondary 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Primary Split View Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">

        {/* Left Side details (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Header Title */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">{gym.name}</h1>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{averageRating} ({reviews.length} Ulasan)</span>
              </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{gym.address}</span>
            </p>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Operasional: {gym.operating_hours} WIB (Setiap Hari)</span>
            </p>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-900" />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Deskripsi</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{gym.description}</p>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-900" />

          {/* Facilities */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Fasilitas Tersedia</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gym.facilities.map((fac) => (
                <div key={fac} className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{fac}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-900" />

          {/* Location Map */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Lokasi Peta</h3>
            <div className="h-72 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-900 shadow-inner z-0">
              <GymMap gyms={[gym]} center={[gym.latitude, gym.longitude]} zoom={14} />
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-900" />

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-display">Ulasan Pengunjung</h3>
              <span className="text-xs text-zinc-400">{reviews.length} Ulasan Terverifikasi</span>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-zinc-500 text-xs italic">Belum ada ulasan untuk gym ini.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-900 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'}
                          alt={rev.user_name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500/20"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{rev.user_name}</h4>
                          <span className="text-[9px] text-zinc-400">{new Date(rev.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-1">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review section */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="p-5 border border-emerald-500/10 bg-emerald-500/5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Tulis Ulasan Anda</span>
                </h4>

                {reviewMessage && (
                  <p className="text-xs text-emerald-400 font-semibold">{reviewMessage}</p>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase block font-bold mb-1">Rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                    >
                      <option value={5}>5 Bintang ★★★★★</option>
                      <option value={4}>4 Bintang ★★★★</option>
                      <option value={3}>3 Bintang ★★★</option>
                      <option value={2}>2 Bintang ★★</option>
                      <option value={1}>1 Bintang ★</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase block font-bold mb-1">Komentar / Ulasan</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Bagikan pengalaman Anda berlatih dan menyewa di gym ini..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900 rounded-xl text-center">
                <p className="text-zinc-500 text-xs">
                  Silakan{' '}
                  <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
                    masuk akun
                  </Link>{' '}
                  untuk menulis ulasan.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Sticky Pricing & Booking Card (4 Columns) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="glass bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 p-6 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instan Checkout Enabled</span>
              </span>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white font-display">Pesan Tiket Masuk</h3>
            </div>

            {/* Packages Selection dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase font-bold block">Pilih Paket Membership</label>
              <div className="space-y-2.5">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${selectedPackageId === pkg.id
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-zinc-200 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">{pkg.name}</span>
                      <span className="text-xs font-extrabold text-emerald-500">Rp {pkg.price.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-1 capitalize">Masa Aktif: {pkg.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Display selected package details */}
            {selectedPackage && (
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/60 text-xs">
                <span className="font-bold text-[10px] uppercase text-zinc-400 tracking-wider">Benefit Paket</span>
                <ul className="space-y-1.5 pt-1">
                  {selectedPackage.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guarantee info */}
            <div className="flex items-center gap-2 p-3 bg-indigo-500/5 text-indigo-400 rounded-xl border border-indigo-500/10 text-[10px]">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Rental Baju & Loker dapat ditambahkan pada saat checkout berikutnya.</span>
            </div>

            {/* BOOK NOW Button */}
            <button
              onClick={handleBook}
              disabled={packages.length === 0}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 shadow-lg hover:shadow-emerald-500/5"
            >
              <span>{user ? 'Pesan Sekarang' : 'Masuk Akun & Pesan'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
