'use client';

import Link from 'next/link';
import { Dumbbell, Rss, Share2, Globe, Mail, Shield, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400 border-t border-zinc-900 overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-xl text-black">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span>Gym<span className="text-emerald-400">Ease</span></span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Membantu pekerja kantor aktif berolahraga setelah pulang kerja tanpa beban barang bawaan. Gym premium, rental baju olahraga, loker, dan laundry dalam satu sentuhan.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-emerald-400 transition-colors duration-200" title="Instagram">
                <Rss className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-200" title="Twitter / X">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-200" title="Website">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Site Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#gyms" className="hover:text-emerald-400 transition-colors">Cari Gym</Link></li>
              <li><Link href="/#products" className="hover:text-emerald-400 transition-colors">Rental Pakaian</Link></li>
              <li><Link href="/#packages" className="hover:text-emerald-400 transition-colors">Paket Membership</Link></li>
              <li><Link href="/#faq" className="hover:text-emerald-400 transition-colors">Tanya Jawab (FAQ)</Link></li>
            </ul>
          </div>

          {/* Popular Gyms */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Lokasi Favorit</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Sudirman CBD</li>
              <li>Mega Kuningan</li>
              <li>Senopati Area</li>
              <li>Thamrin Office Center</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Dapatkan Info Promo</h4>
            <p className="text-sm text-zinc-500">Daftarkan email Anda untuk info diskon paket bulanan GymEase.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Email kantor Anda"
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white placeholder-zinc-600 transition-colors"
                required
              />
              <button
                type="submit"
                className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-black font-semibold transition-colors duration-200"
              >
                <Mail className="w-4 h-4 text-black" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} GymEase Indonesia. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ketentuan Layanan</span>
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privasi & Keamanan</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
