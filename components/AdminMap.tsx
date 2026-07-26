'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const customIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface AdminMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function AdminMap({ latitude, longitude, onChange }: AdminMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([latitude, longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      markerRef.current = L.marker([latitude, longitude], { 
        icon: customIcon,
        draggable: true 
      }).addTo(leafletMap.current);

      // Handle drag end
      markerRef.current.on('dragend', () => {
        if (markerRef.current) {
          const pos = markerRef.current.getLatLng();
          onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
        }
      });

      // Handle click on map to move marker
      leafletMap.current.on('click', (e: L.LeafletMouseEvent) => {
        const pos = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(pos);
          onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
        }
      });
    } else {
      const currentPos = markerRef.current?.getLatLng();
      if (currentPos && (currentPos.lat !== latitude || currentPos.lng !== longitude)) {
        markerRef.current?.setLatLng([latitude, longitude]);
        leafletMap.current.setView([latitude, longitude], leafletMap.current.getZoom());
      }
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, onChange]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-900" 
        style={{ zIndex: 1, minHeight: '300px' }}
      />
      <div className="absolute bottom-2 left-2 bg-zinc-950/80 text-white text-[10px] px-2 py-1 rounded border border-zinc-800 pointer-events-none z-[1000]">
        * Klik peta atau seret marker untuk mengubah lokasi koordinat.
      </div>
    </div>
  );
}
