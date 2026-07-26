'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default Leaflet marker
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface GymMapProps {
  gyms: Gym[];
  center?: [number, number];
  zoom?: number;
}

export default function GymMap({
  gyms,
  center = [-6.2235, 106.8166],
  zoom = 12,
}: GymMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  // Membuat map hanya sekali
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap Contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    markerLayerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      markerLayerRef.current?.clearLayers();
      mapRef.current?.remove();

      markerLayerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  // Update posisi map jika center berubah
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setView(center, zoom);
  }, [center, zoom]);

  // Update marker ketika data gym berubah
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    gyms.forEach((gym) => {
      L.marker([gym.latitude, gym.longitude])
        .bindPopup(`
          <div style="min-width:180px">
            <h3 style="font-weight:700;margin-bottom:6px;">
              ${gym.name}
            </h3>
            <p style="margin:0;color:#555;">
              ${gym.address}
            </p>
          </div>
        `)
        .addTo(markerLayerRef.current!);
    });

    // Auto zoom jika gym lebih dari satu
    if (gyms.length > 1) {
      const bounds = L.latLngBounds(
        gyms.map((g) => [g.latitude, g.longitude] as [number, number])
      );

      mapRef.current.fitBounds(bounds, {
        padding: [40, 40],
      });
    }
  }, [gyms]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      style={{
        height: '500px',
        width: '100%',
      }}
    />
  );
}