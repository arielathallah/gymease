import React from 'react';
import Link from 'next/link';
import { Dumbbell, MapPin, Mail, Phone, Instagram, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg">
                <Dumbbell className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                GymEase<span className="text-rose-500">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Workout Without Bringing Anything. GymEase is Indonesia&apos;s leading gym marketplace connecting you with partner gyms nationwide, complete with dry-fit apparel & towel rental at every branch.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center text-slate-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center text-slate-300"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@gymease.co.id"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center text-slate-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/search" className="hover:text-rose-400 transition-colors">Search Gyms</Link></li>
              <li><Link href="/branches" className="hover:text-rose-400 transition-colors">All Branches</Link></li>
              <li><Link href="/packages" className="hover:text-rose-400 transition-colors">Pass Packages</Link></li>
              <li><Link href="/products" className="hover:text-rose-400 transition-colors">Gym Products</Link></li>
              <li><Link href="/booking" className="hover:text-rose-400 transition-colors font-semibold text-rose-400">Book Gym Pass</Link></li>
            </ul>
          </div>

          {/* Indonesian Branches */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Partner Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase Kemanggisan</span></li>
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase Grogol</span></li>
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase BSD</span></li>
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase Bekasi</span></li>
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase Tangerang</span></li>
              <li><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" /> GymEase Depok</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Fit & Informed</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive gym pass promo codes and workout rental discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
              <Button size="sm" className="w-full text-xs">
                Subscribe Promo
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GymEase Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Partner Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
