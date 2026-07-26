'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Dumbbell, Package, ShoppingBag, Shirt, Building2, Users, FileBarChart, Settings, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, adminBranchId, branches } = useAppStore();

  const activeBranch = branches.find((b) => b.id === adminBranchId);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings Management', href: '/admin/bookings', icon: Calendar },
    { name: 'Partner Gyms', href: '/admin/partner-gyms', icon: Dumbbell },
    { name: 'Products Catalog', href: '/admin/products', icon: ShoppingBag },
    { name: 'Pass Packages', href: '/admin/packages', icon: Package },
    { name: 'Rental Inventory', href: '/admin/rentals', icon: Shirt },
    { name: 'Branches Overview', href: '/admin/branches', icon: Building2 },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reports & Export', href: '/admin/reports', icon: FileBarChart },
    { name: 'Admin Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="px-2 pt-2">
          <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xl tracking-tight">
            <Dumbbell className="w-6 h-6" />
            GymEase Admin
          </div>
          
          {/* Branch Isolation Status Box */}
          <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Access Scope:</span>
              <Badge variant={currentRole === 'super_admin' ? 'rose' : 'amber'}>
                {currentRole === 'super_admin' ? 'Super Admin' : 'Branch Admin'}
              </Badge>
            </div>
            {currentRole === 'branch_admin' ? (
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {activeBranch?.name || 'Kemanggisan Branch'} Only
              </div>
            ) : (
              <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                All 6 Indonesian Branches
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RLS Security Notice */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-400">Supabase RLS Active</div>
        <p>Row level security enforces branch data isolation across all endpoints.</p>
      </div>
    </aside>
  );
};
