'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('user');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto px-4 py-16 w-full flex items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome to GymEase</h2>
            <p className="text-xs text-slate-400">Login to access your bookings & QR tickets.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi.santoso@gmail.com"
                className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <label className="text-slate-700 dark:text-slate-300">Password</label>
                <Link href="/auth/forgot-password" className="text-rose-500 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              <LogIn className="w-4 h-4 mr-2" /> Login to Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-rose-500 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
