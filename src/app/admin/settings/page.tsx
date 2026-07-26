'use client';

import React from 'react';
import { Settings, ShieldCheck, Database, Server } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <div>
        <Badge variant="rose">System Config</Badge>
        <h1 className="text-2xl font-black text-white mt-1">Admin Security Settings</h1>
        <p className="text-xs text-slate-400">Row level security, API middleware, and database status.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Supabase Row Level Security (RLS)
          </span>
          <Badge variant="emerald">ACTIVE</Badge>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" /> PostgreSQL Connection
          </span>
          <Badge variant="emerald">CONNECTED</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" /> Branch Isolation Middleware
          </span>
          <Badge variant="emerald">ENFORCED</Badge>
        </div>
      </Card>
    </div>
  );
}
