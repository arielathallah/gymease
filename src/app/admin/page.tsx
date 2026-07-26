'use client';

import React from 'react';
import { DollarSign, Calendar, Users, Shirt, TrendingUp, ShieldAlert, Dumbbell, Package, MapPin } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useAppStore } from '@/lib/store';
import { INITIAL_DASHBOARD_STATS } from '@/lib/mock-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard.service";

export default function AdminDashboardPage() {
  console.log("ADMIN PAGE");
  const [bookingsData, setBookingsData] = useState([]);
  const { currentRole, adminBranchId, branches, bookings } = useAppStore();
  const activeBranch = branches.find((b) => b.id === adminBranchId);
  useEffect(() => {
    console.log("useEffect jalan");

    async function loadData() {
      console.log("Masuk loadData");

      try {
        const data = await getDashboardStats();

        console.log("DATA DARI SUPABASE:", data);

        setBookingsData(data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    loadData();
  }, []);

  // Scoped Data check
  const isBranchScoped = currentRole === 'branch_admin';
  const displayedBookings = isBranchScoped
    ? bookings.filter((b) => b.branch_id === adminBranchId)
    : bookings;

  const COLORS = ['#e11d48', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Title & Branch Isolation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant={isBranchScoped ? 'amber' : 'rose'}>
            {isBranchScoped ? `BRANCH ADMIN SCOPE [${activeBranch?.name}]` : 'SUPER ADMIN GLOBAL OVERVIEW'}
          </Badge>
          <h1 className="text-3xl font-black text-white mt-1">
            Analytics & Executive Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Realtime revenue, booking trends, rental apparel statistics, and partner metrics.
          </p>
        </div>
      </div>

      {/* RLS Notice Banner */}
      {isBranchScoped && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Supabase Row Level Security (RLS) Active: </span>
            You are currently viewing data isolated strictly for <span className="font-bold text-white">{activeBranch?.name}</span>. Data for BSD, Grogol, Bekasi, Tangerang, and Depok is restricted from your access token.
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Revenue</span>
            <DollarSign className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatRupiah(isBranchScoped ? 11800000 : INITIAL_DASHBOARD_STATS.totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
          </span>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Bookings</span>
            <Calendar className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {displayedBookings.length > 0 ? displayedBookings.length : (isBranchScoped ? 152 : INITIAL_DASHBOARD_STATS.totalBookings)}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.1% growth
          </span>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Customers</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {isBranchScoped ? 114 : INITIAL_DASHBOARD_STATS.activeCustomers}
          </div>
          <span className="text-[11px] text-slate-400">Verified gym users</span>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rental Kits Issued</span>
            <Shirt className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {isBranchScoped ? 245 : INITIAL_DASHBOARD_STATS.totalRentals}
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">99.8% returned clean</span>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue & Booking Area Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" /> Monthly Revenue Trend (IDR)
            </h3>
          </CardHeader>
          <CardBody className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INITIAL_DASHBOARD_STATS.revenueChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => formatRupiah(val)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e11d48" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Branch Statistics Bar Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" /> Revenue by Branch Hub
            </h3>
          </CardHeader>
          <CardBody className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_DASHBOARD_STATS.branchStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="branch_name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => formatRupiah(val)}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Top Gyms & Products Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gym Partners */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-rose-500" /> Top Performing Gym Partners
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {INITIAL_DASHBOARD_STATS.topGyms.map((g, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">{g.name}</div>
                  <div className="text-slate-400">{g.bookings} Booked Passes</div>
                </div>
                <div className="text-right font-black text-rose-400 text-sm">
                  {formatRupiah(g.revenue)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Top Sold Products */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" /> Top Products & Supplements
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {INITIAL_DASHBOARD_STATS.topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">{p.name}</div>
                  <div className="text-slate-400">{p.sales} Units Sold</div>
                </div>
                <div className="text-right font-black text-amber-400 text-sm">
                  {formatRupiah(p.revenue)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
