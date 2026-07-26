'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, Mail, Lock, User, Phone } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              role: 'customer' // Defaults to customer
            }
          }
        });
        if (error) throw error;
        
        setSuccessMsg('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err.message || 'Pendaftaran gagal. Periksa kembali input Anda.');
      } finally {
        setLoading(false);
      }
    } else {
      // Mock registration
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Pendaftaran simulasi berhasil! Mengarahkan ke halaman masuk...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }, 1000);
    }
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Buat akun untuk memesan gym dan rental sportswear</p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Nomor Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="tel"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="budi@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-zinc-900 dark:text-white"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-xs text-zinc-500 text-center">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Masuk di Sini
          </Link>
        </p>

      </div>
    </div>
  );
}
