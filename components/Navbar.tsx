'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Dumbbell, User, LayoutDashboard, LogOut, Settings,
  ChevronDown, Bell, Menu, X, Sun, Moon, Terminal, ShieldAlert
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getCurrentUser, setMockUser } from '@/services/user';
import { listNotificationsByUserId, markNotificationAsRead } from '@/services/notification';
import { Profile, Notification } from '@/types';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.is_read);

  // Role Swapper (for demo fallback mode)
  const [showRoleSwapper, setShowRoleSwapper] = useState(false);

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const notifs = await listNotificationsByUserId(currentUser.id);
        setNotifications(notifs);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Set up polling/interval to check for updates (e.g. notifications or login switches)
    const interval = setInterval(fetchUserData, 4000);

    // If supabase is configured, listen to auth changes
    let authSubscription: any = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(() => {
        fetchUserData();
      });
      authSubscription = data.subscription;
    }

    return () => {
      clearInterval(interval);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    // Always clear mock user
    setMockUser(null);
    setUser(null);
    router.push('/');
    router.refresh();
  };

  // Mock roles for testing
  const swapMockRole = (role: 'guest' | 'customer' | 'admin') => {
    if (role === 'guest') {
      setMockUser(null);
      setUser(null);
    } else if (role === 'customer') {
      const profile = {
        id: '11111111-1111-4111-8111-111111111111',
        role: 'customer' as const,
        full_name: 'Budi Santoso',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
        phone: '081234567890',
        created_at: new Date().toISOString()
      };
      setMockUser(profile);
      setUser(profile);
    } else if (role === 'admin') {
      const profile = {
        id: '22222222-2222-4222-8222-222222222222',
        role: 'admin' as const,
        full_name: 'Admin GymEase',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
        phone: '081122334455',
        created_at: new Date().toISOString()
      };
      setMockUser(profile);
      setUser(profile);
    }
    setProfileDropdownOpen(false);
    fetchUserData();
    router.refresh();
  };

  const handleReadNotification = async (id: string) => {
    await markNotificationAsRead(id);
    if (user) {
      const notifs = await listNotificationsByUserId(user.id);
      setNotifications(notifs);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-zinc-900 bg-white/70 dark:bg-black/60 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-xl">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span>Gym<span className="text-emerald-500">Ease</span></span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/#gyms" className="hover:text-emerald-500 transition-colors">Gym Mitra</Link>
            <Link href="/#products" className="hover:text-emerald-500 transition-colors">Rental Baju</Link>
            <Link href="/#packages" className="hover:text-emerald-500 transition-colors">Paket</Link>
            <Link href="/#faq" className="hover:text-emerald-500 transition-colors">FAQ</Link>
            <button
              type="button"
              onClick={() => swapMockRole('admin')}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Go Admin
            </button>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-200"
              title="Toggle Theme"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-200 relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white">Notifikasi ({unreadNotifs.length})</span>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={async () => {
                            for (const n of unreadNotifs) {
                              await handleReadNotification(n.id);
                            }
                          }}
                          className="text-xs text-emerald-500 hover:underline"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-zinc-500">Tidak ada notifikasi</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleReadNotification(n.id)}
                            className={`p-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer ${!n.is_read ? 'bg-emerald-500/5 dark:bg-emerald-500/5' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-xs font-semibold ${!n.is_read ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-zinc-400">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              // User Menu
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full border border-zinc-200 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/20"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-900">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5 capitalize">{user.role}</p>
                    </div>
                    <div className="py-1">
                      {user.role === 'admin' ? (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                          <span>Dashboard Saya</span>
                        </Link>
                      )}
                      <Link
                        href={user.role === 'admin' ? '/admin#settings' : '/dashboard/settings'}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        <span>Pengaturan</span>
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login / Signin
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-black rounded-lg transition-colors"
              >
                Masuk / Daftar
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 py-4 space-y-3 flex flex-col text-sm font-medium shadow-lg animate-in slide-in-from-top duration-200">
            <Link href="/#gyms" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-500 py-1 transition-colors">Gym Mitra</Link>
            <Link href="/#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-500 py-1 transition-colors">Rental Baju</Link>
            <Link href="/#packages" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-500 py-1 transition-colors">Paket</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-500 py-1 transition-colors">FAQ</Link>
            <button
              type="button"
              onClick={() => {
                swapMockRole('admin');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Go Admin
            </button>
          </div>
        )}
      </nav>

      {/* Floating Developer Grading Role Swapper */}
      {!isSupabaseConfigured && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showRoleSwapper && (
            <div className="p-3 bg-zinc-950/90 dark:bg-black/90 border border-emerald-500/30 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-1.5 min-w-[200px] text-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono border-b border-zinc-800 pb-1.5 mb-1.5 uppercase font-bold tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>Demo Controls</span>
              </div>
              <button
                onClick={() => swapMockRole('guest')}
                className={`px-2.5 py-1.5 rounded-lg font-medium text-left transition-colors duration-150 ${!user ? 'bg-emerald-500 text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}
              >
                1. Mode Pengunjung (Guest)
              </button>
              <button
                onClick={() => swapMockRole('customer')}
                className={`px-2.5 py-1.5 rounded-lg font-medium text-left transition-colors duration-150 ${user?.role === 'customer' ? 'bg-emerald-500 text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}
              >
                2. Mode Pelanggan (Customer)
              </button>
              <button
                onClick={() => swapMockRole('admin')}
                className={`px-2.5 py-1.5 rounded-lg font-medium text-left transition-colors duration-150 ${user?.role === 'admin' ? 'bg-emerald-500 text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}
              >
                3. Mode Pengelola (Admin)
              </button>
              <div className="mt-1 border-t border-zinc-900 pt-1.5 text-[9px] text-zinc-500 font-mono italic leading-normal">
                * Membantu penguji berganti akun tanpa mendaftar ulang.
              </div>
            </div>
          )}
          <button
            onClick={() => setShowRoleSwapper(!showRoleSwapper)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-emerald-500/40 text-emerald-400 font-semibold rounded-full shadow-lg hover:bg-zinc-800 transition-all duration-200 text-xs scale-100 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Grading Controls</span>
          </button>
        </div>
      )}
    </>
  );
}
