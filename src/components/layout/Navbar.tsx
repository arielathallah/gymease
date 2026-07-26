'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Search, User, ShieldCheck, ShoppingBag, Heart, Menu, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RoleName } from '@/types';

export const Navbar: React.FC = () => {
  const { currentRole, setRole, adminBranchId, wishlistGymIds, wishlistProductIds, branches } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeBranch = branches.find((b) => b.id === adminBranchId);

  const totalWishlist = wishlistGymIds.length + wishlistProductIds.length;

  const rolesList: { role: RoleName; label: string; badge: string; desc: string }[] = [
    { role: 'guest', label: 'Guest User', badge: 'Public', desc: 'Browse every feature without login' },
    { role: 'user', label: 'Registered User', badge: 'Member', desc: 'Access bookings, wishlist & QR tickets' },
    { role: 'branch_admin', label: 'Branch Admin (Kemanggisan)', badge: 'RLS Scoped', desc: 'Manage ONLY Kemanggisan Branch' },
    { role: 'super_admin', label: 'Super Admin', badge: 'Global', desc: 'Full system management & analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      {/* Top Banner Role Switcher Bar for instant demo testing */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Role Access Control:</span>
          <span className="hidden sm:inline text-slate-400">Current Role:</span>
          <Badge variant={currentRole === 'super_admin' ? 'rose' : currentRole === 'branch_admin' ? 'amber' : 'emerald'}>
            {currentRole.toUpperCase()}
          </Badge>
          {currentRole === 'branch_admin' && (
            <span className="text-amber-400 text-xs font-semibold">
              [{activeBranch?.name || 'Kemanggisan Branch'}]
            </span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Switch Demo Role
            <ChevronDown className="w-3 h-3" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Select System Role
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setRole(r.role, r.role === 'branch_admin' ? 'b001' : undefined);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex flex-col gap-0.5 transition-colors ${currentRole === r.role
                      ? 'bg-rose-950/60 border border-rose-800 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between font-semibold text-xs">
                    <span>{r.label}</span>
                    {currentRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              GymEase<span className="text-rose-500">.</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Workout Without Bringing Anything
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Link href="/search" className="hover:text-rose-500 transition-colors flex items-center gap-1">
            <Search className="w-4 h-4 text-slate-400" />
            Search Gyms
          </Link>
          <button
            type="button"
            onClick={() => {
              setRole('super_admin');
              setRoleDropdownOpen(false);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Go Admin
          </button>
          <Link href="/branches" className="hover:text-rose-500 transition-colors">
            Branches
          </Link>
          <Link href="/packages" className="hover:text-rose-500 transition-colors">
            Packages
          </Link>
          <Link href="/products" className="hover:text-rose-500 transition-colors">
            Products
          </Link>
          {currentRole !== 'guest' && (
            <Link href="/dashboard" className="hover:text-rose-500 transition-colors">
              User Dashboard
            </Link>
          )}
          {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
            <Link href="/admin" className="hover:text-rose-500 font-semibold text-rose-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Wishlist Link */}
          <Link
            href={currentRole === 'guest' ? '/auth/login?redirect=/dashboard/wishlist' : '/dashboard/wishlist'}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-rose-500" />
            {totalWishlist > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </Link>

          {/* Book Gym CTA Button */}
          <Link href="/booking">
            <Button size="sm" className="hidden sm:inline-flex">
              Book Gym Now
            </Button>
          </Link>

          {/* Auth Button */}
          {currentRole === 'guest' ? (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                  U
                </div>
              </div>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Search Gyms
          </Link>
          <Link
            href="/branches"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Branches
          </Link>
          <Link
            href="/packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Packages
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Products
          </Link>
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-rose-500 font-bold"
          >
            Book Gym Now
          </Link>
          <button
            type="button"
            onClick={() => {
              setRole('super_admin');
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
          >
            <ShieldCheck className="w-4 h-4" />
            Go Admin
          </button>
          {currentRole !== 'guest' && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              User Dashboard
            </Link>
          )}
          {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-rose-500 font-bold"
            >
              Admin Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
