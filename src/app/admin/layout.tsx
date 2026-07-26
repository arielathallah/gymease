'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Dumbbell, ArrowLeft } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { RoleName } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, setRole, adminBranchId, branches } = useAppStore();

  const activeBranch = branches.find((b) => b.id === adminBranchId);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Security Mode:</span>
              <Badge variant={currentRole === 'super_admin' ? 'rose' : 'amber'}>
                {currentRole === 'super_admin' ? 'SUPER ADMIN (ALL BRANCHES)' : `BRANCH ADMIN (${activeBranch?.code})`}
              </Badge>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Simulate Admin Role:</span>
            <button
              onClick={() => setRole('branch_admin', 'b001')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                currentRole === 'branch_admin'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Branch Admin (Kemanggisan)
            </button>
            <button
              onClick={() => setRole('super_admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                currentRole === 'super_admin'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Super Admin
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
