'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Plus, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatRupiah } from '@/lib/utils';

export default function AdminProductsPage() {
  const { products, branches, addProduct } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState(branches[0].id);
  const [price, setPrice] = useState(150000);
  const [stock, setStock] = useState(20);
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80');
  const [categoryName, setCategoryName] = useState('Supplements');
  const [description, setDescription] = useState('High quality gym supplement.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branchObj = branches.find((b) => b.id === branchId);

    addProduct({
      branch_id: branchId,
      branch_name: branchObj?.name,
      category_name: categoryName,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      price: Number(price),
      stock: Number(stock),
      main_image: mainImage,
      rating: 5.0,
    });

    setModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="rose">Inventory Control</Badge>
          <h1 className="text-2xl font-black text-white mt-1">
            Products & Supplements Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage supplements, gear, prices, and branch stock levels.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                <Image src={p.main_image} alt={p.name} fill className="object-cover" />
              </div>
              <CardBody className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald">{p.category_name}</Badge>
                  <span className="text-xs text-rose-400 font-semibold">{p.branch_name}</span>
                </div>
                <h3 className="font-bold text-base text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-black text-white">{formatRupiah(p.price)}</span>
                  <span className="text-xs text-emerald-400 font-bold">Stock: {p.stock}</span>
                </div>
              </CardBody>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
              <Button variant="danger" size="sm">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Product to Branch Inventory">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 uppercase">Product Name</label>
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
              <label className="font-bold text-slate-300 uppercase">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-300 uppercase">Category</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
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
              <label className="font-bold text-slate-300 uppercase">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 uppercase">Image URL</label>
            <input
              type="text"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 uppercase">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
