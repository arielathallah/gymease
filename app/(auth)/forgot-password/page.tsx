'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Mail, ArrowLeft } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`
        });
        if (error) throw error;
        setMessage('Tautan pemulihan kata sandi telah dikirim ke email Anda.');
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memproses pemulihan kata sandi.');
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setMessage('Simulasi: Email pemulihan kata sandi telah berhasil dikirim.');
      }, 800);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] glow-bg rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 text-left">
        
        {/* Back Link */}
        <div>
          <Link href="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-400">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-zinc-900 dark:text-white justify-center">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-xl">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span>Gym<span className="text-emerald-500">Ease</span></span>
          </Link>
          <h2 className="text-sm font-bold text-zinc-950 dark:text-white">Lupa Kata Sandi?</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Masukkan email terdaftar Anda untuk menerima tautan atur ulang kata sandi.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-semibold">
            {message}
          </div>
        )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
          >
            {loading ? 'Mengirim email...' : 'Kirim Link Reset'}
          </button>
        </form>

      </div>
    </div>
  );
}
