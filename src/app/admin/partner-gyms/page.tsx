'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dumbbell, Plus, MapPin, Upload, Star, CheckCircle2, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function PartnerGymsAdminPage() {
  const { gyms, branches, addPartnerGym } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Lecturer Form Inputs
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState(branches[0].id);
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80');
  const [galleryInput, setGalleryInput] = useState('https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1000&q=80, https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com/?q=-6.1954,106.7865');
  const [latitude, setLatitude] = useState('-6.1954');
  const [longitude, setLongitude] = useState('106.7865');
  const [facilitiesInput, setFacilitiesInput] = useState('Locker Room, Shower, Sauna, WiFi, Personal Trainer');
  const [description, setDescription] = useState('State of the art fitness facility with complete equipment set and rental gear support.');
  const [openingHours, setOpeningHours] = useState('06:00');
  const [closingHours, setClosingHours] = useState('22:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branchObj = branches.find((b) => b.id === branchId);

    addPartnerGym({
      branch_id: branchId,
      branch_name: branchObj?.name,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      main_image: mainImage,
      gallery: galleryInput.split(',').map((s) => s.trim()),
      facilities: facilitiesInput.split(',').map((s) => s.trim()),
      google_maps_url: googleMapsUrl,
      latitude: parseFloat(latitude) || -6.1954,
      longitude: parseFloat(longitude) || 106.7865,
      opening_hours: openingHours,
      closing_hours: closingHours,
      status: 'active',
    });

    setModalOpen(false);
    // Reset form
    setName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="rose">Lecturer Requirement</Badge>
          <h1 className="text-2xl font-black text-white mt-1">
            Partner Gym Management
          </h1>
          <p className="text-xs text-slate-400">
            Add new partner gyms, configure map coordinates, upload galleries & operating hours.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Partner Gym
        </Button>
      </div>

      {/* Gym List Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.map((g) => (
          <Card key={g.id} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                <Image src={g.main_image} alt={g.name} fill className="object-cover" />
              </div>
              <CardBody className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="rose">{g.branch_name}</Badge>
                  <span className="text-xs text-amber-400 font-bold">⭐ {g.rating}</span>
                </div>
                <h3 className="font-bold text-base text-white">{g.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Lat: {g.latitude} | Lng: {g.longitude}
                </div>
                <div className="text-[11px] text-slate-500">
                  Hours: {g.opening_hours} - {g.closing_hours}
                </div>
              </CardBody>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
              <Button variant="danger" size="sm">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD PARTNER GYM MODAL (FULFILLS LECTURER REQUIREMENT) */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Partner Gym (Admin)" maxWidth="2xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 uppercase">Gym Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Iron Gym Kemanggisan"
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 uppercase">Assign Branch</label>
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
              <label className="font-bold text-slate-300 uppercase">Main Image URL</label>
              <input
                type="text"
                required
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 uppercase">Gallery Image URLs (Comma Separated)</label>
            <textarea
              rows={2}
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>

          {/* Google Maps & Coordinates */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase">Google Maps URL</label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 uppercase">Latitude</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 uppercase">Longitude</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
          </div>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 uppercase">Opening Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="06:00"
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 uppercase">Closing Hours</label>
              <input
                type="text"
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
                placeholder="22:00"
                className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 uppercase">Facilities (Comma Separated)</label>
            <input
              type="text"
              value={facilitiesInput}
              onChange={(e) => setFacilitiesInput(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 uppercase">Gym Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Partner Gym
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
