'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Mail, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Reset Password</h2>
            <p className="text-xs text-slate-400">Enter your email to receive a password reset link.</p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                Reset link sent to {email}! Check your email inbox.
              </p>
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="mt-2 text-xs">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@gmail.com"
                  className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700"
                />
              </div>

              <Button type="submit" size="lg" className="w-full font-bold">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-400">
            <Link href="/auth/login" className="font-bold text-rose-500 hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
