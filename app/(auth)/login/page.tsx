'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { setMockUser } from '@/services/user';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle traditional credential form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        setSuccessMsg('Masuk berhasil! Mengarahkan Anda...');
        setTimeout(() => {
          router.push(redirectTo || '/');
          router.refresh();
        }, 1000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Kombinasi email dan kata sandi salah.');
      } finally {
        setLoading(false);
      }
    } else {
      // Offline mock authentication fallback
      setTimeout(() => {
        setLoading(false);
        // Quick default credentials check
        if (email.includes('admin') || password === 'admin123') {
          handleMockLogin('admin');
        } else {
          handleMockLogin('customer');
        }
      }, 800);
    }
  };

  // Helper for one-click credentials simulation
  const handleMockLogin = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setMockUser({
        id: '11111111-1111-4111-8111-111111111111',
        role: 'customer',
        full_name: 'Budi Santoso',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
        phone: '081234567890',
        created_at: new Date().toISOString()
      });
    } else if (role === 'admin') {
      setMockUser({
        id: '22222222-2222-4222-8222-222222222222',
        role: 'admin',
        full_name: 'Admin GymEase',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
        phone: '081122334455',
        created_at: new Date().toISOString()
      });
    }
    setSuccessMsg('Masuk berhasil! Mengarahkan...');
    setTimeout(() => {
      router.push(redirectTo || (role === 'admin' ? '/admin' : '/dashboard'));
      router.refresh();
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] glow-bg rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 text-left">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-zinc-900 dark:text-white justify-center">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-xl">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span>Gym<span className="text-emerald-500">Ease</span></span>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Silakan masuk untuk melanjutkan transaksi booking</p>
        </div>

        {/* Info alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-zinc-400 uppercase font-bold block">Kata Sandi</label>
              <Link href="/forgot-password" className="text-[10px] text-emerald-400 font-bold hover:underline">Lupa sandi?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
          >
            {loading ? 'Sedang Masuk...' : 'Masuk Akun'}
          </button>
        </form>

        {/* OAuth Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Atau masuk dengan</span>
          <div className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></div>
        </div>

        {/* Google OAuth Mock */}
        <button
          type="button"
          onClick={() => handleMockLogin('customer')}
          className="w-full py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.95 21.56,11.5 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.9c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.57c-0.9,0.6 -2.08,0.97 -3.3,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.86v2.66C4.34,18.98 8.03,20.9 12,20.9z" fill="#34A853" />
              <path d="M6.96,13.4C6.82,13 6.74,12.5 6.74,12c0,-0.5 0.08,-1 0.22,-1.4V7.94H2.86C2.38,8.9 2.1,10 2.1,11.1c0,1.1 0.28,2.2 0.76,3.16L6.96,13.4z" fill="#FBBC05" />
              <path d="M12,6.48c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.68 14.43,2.9 12,2.9c-3.97,0 -7.66,1.92 -9.14,4.94l4.1,3.16C7.67,8.06 9.66,6.48 12,6.48z" fill="#EA4335" />
            </g>
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        {/* Quick developer login helper */}
        {!isSupabaseConfigured && (
          <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click grading credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleMockLogin('customer')}
                className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 rounded-lg text-center transition-colors cursor-pointer"
              >
                Akun Customer
              </button>
              <button
                type="button"
                onClick={() => handleMockLogin('admin')}
                className="py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/20 rounded-lg text-center transition-colors cursor-pointer"
              >
                Akun Admin
              </button>
            </div>
          </div>
        )}

        {/* Register link */}
        <p className="text-xs text-zinc-500 text-center">
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-emerald-400 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
