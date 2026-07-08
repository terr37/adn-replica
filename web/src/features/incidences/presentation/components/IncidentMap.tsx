'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Crosshair, X, AlertTriangle, Lightbulb, Trash2 } from 'lucide-react';
import { useIncidenciasViales } from '../../../aseo/presentation/hooks/useIncidenciasViales';

// Iconos personalizados Leaflet alineados con la paleta premium
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(5,20,41,0.35);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const obraIcon = createCustomIcon('#051429');
const mantenimientoIcon = createCustomIcon('#B8902F');
const pendingIcon = createCustomIcon('#EF4444');

interface ClickedLocation {
  lat: number;
  lng: number;
}

type IncidentType = 'bache' | 'basura';

// Sub-component that handles map click events
const MapClickHandler: React.FC<{
  isActive: boolean;
  onLocationSelect: (loc: ClickedLocation) => void;
}> = ({ isActive, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (isActive) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

export const IncidentMap: React.FC = () => {
  const { incidencias, reportarIncidenciaVial, isLoading } = useIncidenciasViales();
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const center: [number, number] = [18.4861, -69.9312];

  const handleStartPicking = () => {
    setIsPickingLocation(true);
    setClickedLocation(null);
  };

  const handleCancelPicking = () => {
    setIsPickingLocation(false);
    setClickedLocation(null);
  };

  const handleLocationSelect = (loc: ClickedLocation) => {
    setClickedLocation(loc);
  };

  const handleConfirmIncident = async (tipo: IncidentType, titulo: string) => {
    if (!clickedLocation) return;
    setIsSubmitting(true);
    try {
      await reportarIncidenciaVial(clickedLocation.lat, clickedLocation.lng, tipo, titulo);
      setClickedLocation(null);
      setIsPickingLocation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-[650px] overflow-hidden bg-slate-100 flex flex-col justify-end md:justify-center">

      {/* Map Area */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className={`w-full h-full ${isPickingLocation ? 'cursor-crosshair' : ''}`}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Click handler */}
          <MapClickHandler isActive={isPickingLocation} onLocationSelect={handleLocationSelect} />

          {/* Existing incidents */}
          {incidencias?.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={incident.tipo === 'bache' ? obraIcon : mantenimientoIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1">
                  <div className="text-[11px] font-bold tracking-wider text-[#B8902F] uppercase mb-0.5">
                    {incident.tipo === 'bache' ? 'Bache/Obra' : 'Mantenimiento/Basura'}
                  </div>
                  <div className="text-sm font-sans font-bold text-[#051429]">
                    {incident.titulo}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Pending marker for clicked location */}
          {clickedLocation && (
            <Marker
              position={[clickedLocation.lat, clickedLocation.lng]}
              icon={pendingIcon}
            />
          )}
        </MapContainer>
      </div>

      {/* Picking mode banner */}
      {isPickingLocation && !clickedLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-[#051429]/90 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto">
          <Crosshair className="w-5 h-5 text-[#B8902F] animate-pulse" />
          <span className="text-sm font-bold">Haga clic en el mapa para seleccionar la ubicación</span>
          <button onClick={handleCancelPicking} className="ml-2 text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Type selector modal when location is picked */}
      {clickedLocation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[#051429]/20 border border-slate-200 p-6 w-[340px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#051429]">Tipo de Incidencia</h3>
              <button onClick={handleCancelPicking} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Lat: {clickedLocation.lat.toFixed(4)}, Lng: {clickedLocation.lng.toFixed(4)}
            </p>

            <div className="space-y-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleConfirmIncident('bache', 'Bache reportado por ciudadano')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#051429] hover:bg-[#051429]/5 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#051429] rounded-lg flex items-center justify-center transition-colors">
                  <AlertTriangle className="w-5 h-5 text-slate-500 group-hover:text-[#E9D9AE] transition-colors" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-[#051429]">Bache / Obra vial</span>
                  <p className="text-[11px] text-slate-400">Daño en la superficie de rodamiento</p>
                </div>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleConfirmIncident('basura', 'Basura/Luminaria reportada por ciudadano')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#B8902F] hover:bg-[#B8902F]/5 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#B8902F] rounded-lg flex items-center justify-center transition-colors">
                  <Trash2 className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-[#051429]">Basura / Luminaria</span>
                  <p className="text-[11px] text-slate-400">Acumulación de residuos o falla eléctrica</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop overlay card */}
      <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          <div className="w-full max-w-[380px] p-8 bg-white/95 backdrop-blur-md shadow-2xl shadow-[#051429]/10 border border-slate-200/80 rounded-2xl pointer-events-auto flex flex-col hidden md:flex transition-all duration-300">

            <h2 className="text-3xl font-sans font-black tracking-tight text-[#051429] mb-3 leading-none">
              Intervenciones <br />
              <span className="text-[#B8902F]">Urbanas</span>
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Explore el mapa cartográfico interactivo para auditar las obras de infraestructura y mantenimientos civiles vigentes en su cuadrante.
            </p>

            {/* Leyenda Técnica */}
            <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#051429] border-2 border-white shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#051429] leading-tight">Obras Mayores</span>
                  <span className="text-[11px] text-slate-400">Reordenamiento e infraestructura</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#B8902F] border-2 border-white shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#051429] leading-tight">Mantenimiento Preventivo</span>
                  <span className="text-[11px] text-slate-400">Arborización y aseo urbano</span>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <button
              onClick={isPickingLocation ? handleCancelPicking : handleStartPicking}
              disabled={isLoading || isSubmitting}
              className={`w-full mt-4 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all group disabled:opacity-50 ${
                isPickingLocation
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
                  : 'bg-[#051429] hover:bg-[#051429]/90 text-white shadow-[#051429]/10'
              }`}>
              {isPickingLocation ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar Reporte
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#E9D9AE] group-hover:scale-110 transition-transform" />
                  Reportar Incidencia Ciudadana
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile control */}
      <div className="md:hidden relative z-[1000] w-full p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 pointer-events-auto flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-sans font-black text-[#051429]">Intervenciones Urbanas</span>
          <div className="flex gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#051429]"></span> Obra</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B8902F]"></span> Mant.</span>
          </div>
        </div>
        <button
          onClick={isPickingLocation ? handleCancelPicking : handleStartPicking}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold ${
            isPickingLocation
              ? 'bg-rose-500 text-white'
              : 'bg-[#051429] text-white'
          }`}
        >
          {isPickingLocation ? (
            <><X className="w-3.5 h-3.5" /> Cancelar</>
          ) : (
            <><MapPin className="w-3.5 h-3.5 text-[#E9D9AE]" /> Reportar Incidencia</>
          )}
        </button>
      </div>

    </div>
  );
};