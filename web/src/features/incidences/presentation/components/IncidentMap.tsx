'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Building2 } from 'lucide-react';

const createDelegationIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: #B8902F; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(5,20,41,0.35);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const delegationIcon = createDelegationIcon();

interface Delegation {
  id: string;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
}

const DELEGATIONS: Delegation[] = [
  {
    id: 'palacio-municipal',
    name: 'Palacio Municipal',
    address: 'Av. Independencia esq. Mercedes, Santo Domingo',
    hours: 'Lun - Vie: 8:00 AM - 5:00 PM',
    lat: 18.4861,
    lng: -69.9312,
  },
  {
    id: 'centro-servicios-este',
    name: 'Centro de Servicios - Zona Este',
    address: 'Av. Las Américas, Santo Domingo',
    hours: 'Lun - Vie: 8:00 AM - 5:00 PM',
    lat: 18.4850,
    lng: -69.8900,
  },
  {
    id: 'centro-servicios-oeste',
    name: 'Centro de Servicios - Zona Oeste',
    address: 'Calle Colón, Santo Domingo',
    hours: 'Lun - Vie: 8:00 AM - 5:00 PM',
    lat: 18.4900,
    lng: -69.9750,
  },
];

export const IncidentMap: React.FC = () => {
  const center: [number, number] = [18.4861, -69.9312];

  return (
    <div className="relative w-full h-[650px] overflow-hidden bg-slate-100 flex flex-col justify-end md:justify-center">

      {/* Map Area */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Delegation Markers */}
          {DELEGATIONS.map((delegation) => (
            <Marker
              key={delegation.id}
              position={[delegation.lat, delegation.lng]}
              icon={delegationIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2">
                  <div className="text-[12px] font-bold tracking-wider text-[#B8902F] uppercase mb-1">
                    Delegación
                  </div>
                  <div className="text-sm font-sans font-bold text-[#051429] mb-2">
                    {delegation.name}
                  </div>
                  <div className="text-xs text-slate-600 mb-2">
                    <div className="font-semibold">{delegation.address}</div>
                    <div className="mt-1 text-[#B8902F] font-semibold">{delegation.hours}</div>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Acuda a esta delegación para radicar sus solicitudes físicas con la documentación requerida.
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Desktop overlay card */}
      <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          <div className="w-full max-w-[380px] p-8 bg-white/95 backdrop-blur-md shadow-2xl shadow-[#051429]/10 border border-slate-200/80 rounded-2xl pointer-events-auto flex flex-col hidden md:flex transition-all duration-300">

            <h2 className="text-3xl font-sans font-black tracking-tight text-[#051429] mb-3 leading-none">
              Delegaciones <br />
              <span className="text-[#B8902F]">Municipales</span>
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Explore las ubicaciones de nuestras delegaciones para radicar sus trámites presencialmente.
            </p>

            {/* Legend - Delegations List */}
            <div className="space-y-3 mb-6">
              {DELEGATIONS.map((delegation) => (
                <div key={delegation.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-[#B8902F] hover:bg-[#B8902F]/5 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#B8902F] border-2 border-white shadow-sm flex-shrink-0 mt-1"></div>
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-sm font-bold text-[#051429] leading-tight">{delegation.name}</span>
                      <span className="text-[11px] text-slate-500">{delegation.address}</span>
                      <span className="text-[11px] font-semibold text-[#B8902F]">{delegation.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info section */}
            <div className="px-4 py-3 bg-yellow-50/50 rounded-xl border border-[#B8902F]/20">
              <p className="text-[12px] text-slate-600 leading-snug">
                📋 Traiga su documentación requerida. Nuestro equipo lo atenderá en horarios de oficina.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile control */}
      <div className="md:hidden relative z-[1000] w-full p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 pointer-events-auto flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#B8902F]" />
          <span className="text-base font-sans font-black text-[#051429]">Delegaciones Municipales</span>
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {DELEGATIONS.map((delegation) => (
            <div key={delegation.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-bold text-sm text-[#051429] mb-1">{delegation.name}</div>
              <div className="text-xs text-slate-600 mb-1">{delegation.address}</div>
              <div className="text-xs font-semibold text-[#B8902F]">{delegation.hours}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};