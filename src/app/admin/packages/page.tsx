'use client';

import React, { useState } from 'react';
import { Package as PackageIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatRupiah } from '@/lib/utils';

export default function AdminPackagesPage() {
  const { packages, addPackage } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(60000);
  const [durationDays, setDurationDays] = useState(1);
  const [description, setDescription] = useState('Pass description');
  const [benefitsInput, setBenefitsInput] = useState('Full Equipment Access, Hot Shower, Free Locker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage({
      name,
      description,
      price: Number(price),
      duration_days: Number(durationDays),
      benefits: benefitsInput.split(',').map((s) => s.trim()),
      image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    });
    setModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="rose">Pass Package Control</Badge>
          <h1 className="text-2xl font-black text-white mt-1">Gym Pass Packages</h1>
          <p className="text-xs text-slate-400">Configure single day and monthly membership packages.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Pass Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-slate-900 border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">{pkg.name}</span>
              {pkg.is_popular && <Badge variant="rose">POPULAR</Badge>}
            </div>
            <p className="text-xs text-slate-400">{pkg.description}</p>
            <div className="text-xl font-black text-rose-400">{formatRupiah(pkg.price)}</div>
            <div className="space-y-1 pt-2 border-t border-slate-800 text-xs">
              {pkg.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {b}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Gym Pass Package">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 uppercase">Package Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 uppercase">Price (IDR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 uppercase">Duration (Days)</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-300 uppercase">Benefits (Comma Separated)</label>
            <textarea
              rows={2}
              value={benefitsInput}
              onChange={(e) => setBenefitsInput(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Package</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
