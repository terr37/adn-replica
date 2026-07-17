'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Trash2, Flame, ShieldAlert, PlusCircle, CheckCircle2, X, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerIncidentesMapa,
  reportarIncidente,
  IncidenteMapaItem,
  SdpApiError,
} from '@/core/infrastructure/apiClient';
import { useAppRefresh } from '@/core/context/AppRefreshContext';

// ============================================================================
// Incident type registry
// ============================================================================
const INCIDENT_TYPES = {
  BASURA:   { label: 'Acumulación de Basura',       color: '#EF4444', icon: Trash2 },
  INCENDIO: { label: 'Incendio / Quema',            color: '#F97316', icon: Flame },
  ARBOL:    { label: 'Árbol Caído / Obstrucción',   color: '#10B981', icon: AlertTriangle },
  AVERIA:   { label: 'Avería Vial (Bache/Semáforo)',color: '#3B82F6', icon: ShieldAlert },
} as const;

type IncidentCategory = keyof typeof INCIDENT_TYPES;

// ============================================================================
// Local Incident shape (normalised from IncidenteMapaItem)
// ============================================================================
interface Incident {
  id: string;
  type: IncidentCategory;
  description: string;
  lat: number;
  lng: number;
  date: Date;
}

// ============================================================================
// API shape → local Incident mapper
// ============================================================================
const CATEGORIA_MAP: Record<string, IncidentCategory> = {
  BASURA:   'BASURA',
  INCENDIO: 'INCENDIO',
  ARBOL:    'ARBOL',
  AVERIA:   'AVERIA',
};

const mapApiItemToIncident = (item: IncidenteMapaItem): Incident => ({
  id: item.incidente_id,
  type: CATEGORIA_MAP[item.categoria.toUpperCase()] ?? 'AVERIA',
  description: item.descripcion,
  lat: item.latitud,
  lng: item.longitud,
  date: new Date(item.fecha_creacion),
});

// ============================================================================
// Leaflet custom icon factory
// ============================================================================
const createCustomIcon = (color: string) =>
  L.divIcon({
    className: 'custom-incident-icon',
    html: `<div style="background-color:${color};width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(5,20,41,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

// ============================================================================
// Map click capture component (React-Leaflet idiom)
// ============================================================================
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => { onMapClick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
};

// ============================================================================
// Main component
// ============================================================================
export const IncidentMap: React.FC = () => {
  const center: [number, number] = [18.4861, -69.9312];
  const { incidentVersion, invalidateIncidents } = useAppRefresh();

  // ── Server incident state ─────────────────────────────────────────────────
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // ── Report form state ─────────────────────────────────────────────────────
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [incidentType, setIncidentType] = useState<IncidentCategory>('BASURA');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // ── Fetch incidents from API ──────────────────────────────────────────────
  const fetchIncidents = useCallback(async () => {
    setIsLoadingMap(true);
    setMapError(null);
    try {
      const raw = await obtenerIncidentesMapa();
      setIncidents(raw.map(mapApiItemToIncident));
    } catch (err: unknown) {
      const msg =
        (err as SdpApiError)?.message ??
        (err instanceof Error ? err.message : 'Error cargando incidencias del mapa.');
      setMapError(msg);
    } finally {
      setIsLoadingMap(false);
    }
  }, []);

  // Re-fetch on mount and whenever another component reports a new incident
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents, incidentVersion]);

  // ── Map click handler ─────────────────────────────────────────────────────
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setShowSuccessNotification(false);
    setSubmitError(null);
  };

  // ── Form submit → reportarIncidente() ─────────────────────────────────────
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoords || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await reportarIncidente({
        categoria: incidentType,
        titulo: INCIDENT_TYPES[incidentType].label,
        descripcion: description.trim(),
        latitud: selectedCoords.lat,
        longitud: selectedCoords.lng,
      });

      // Optimistically add the new incident to local state for instant feedback
      const optimisticIncident: Incident = {
        id: response.data.incidente_id,
        type: incidentType,
        description: description.trim(),
        lat: selectedCoords.lat,
        lng: selectedCoords.lng,
        date: new Date(response.data.fecha_creacion),
      };
      setIncidents((prev) => [optimisticIncident, ...prev]);

      // Reset form
      setSelectedCoords(null);
      setDescription('');
      setShowSuccessNotification(true);

      // Notify other subscribers (e.g. useGetIncidences) to re-fetch
      invalidateIncidents();

      // Auto-hide success notification
      setTimeout(() => setShowSuccessNotification(false), 4000);
    } catch (err: unknown) {
      const msg =
        (err as SdpApiError)?.message ??
        (err instanceof Error ? err.message : 'Error al enviar el reporte. Intente de nuevo.');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared form JSX (reused in desktop + mobile) ──────────────────────────
  const renderForm = (isMobile = false) => (
    <form onSubmit={handleSubmitReport} className={isMobile ? 'space-y-3' : 'flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200'}>
      {!isMobile && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#B8902F] uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" /> Nuevo Reporte
          </div>
          <button
            type="button"
            onClick={() => { setSelectedCoords(null); setSubmitError(null); }}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isMobile && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#B8902F] uppercase">Completar Datos del Reporte</span>
          <button type="button" onClick={() => { setSelectedCoords(null); setSubmitError(null); }} className="text-xs text-slate-400 font-bold">Cancelar</button>
        </div>
      )}

      {submitError && (
        <div className={`flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-700 ${isMobile ? '' : 'mb-3'}`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      <div className={isMobile ? '' : 'mb-4'}>
        {!isMobile && <label className="block text-xs font-bold text-[#051429] mb-1.5">Tipo de Incidencia</label>}
        <select
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value as IncidentCategory)}
          disabled={isSubmitting}
          className={`w-full text-xs bg-slate-50 border border-slate-200 font-semibold text-[#051429] focus:outline-none focus:border-[#B8902F] transition-colors disabled:opacity-60 ${isMobile ? 'rounded-lg p-2' : 'rounded-xl px-3 py-2.5'}`}
        >
          {Object.entries(INCIDENT_TYPES).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>
      </div>

      <div className={isMobile ? '' : 'mb-4'}>
        {!isMobile && <label className="block text-xs font-bold text-[#051429] mb-1.5">Detalles o Descripción</label>}
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          placeholder={isMobile ? 'Describa brevemente la incidencia...' : 'Ej. Hay un cúmulo masivo de bolsas de basura obstruyendo el paso peatonal...'}
          rows={isMobile ? 2 : 3}
          className={`w-full text-xs bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#B8902F] transition-colors resize-none leading-relaxed disabled:opacity-60 ${isMobile ? 'rounded-lg p-2' : 'rounded-xl p-3'}`}
        />
      </div>

      {!isMobile && selectedCoords && (
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 mb-4 font-mono text-[10px] text-slate-500 flex justify-between">
          <span>LAT: {selectedCoords.lat.toFixed(5)}</span>
          <span>LNG: {selectedCoords.lng.toFixed(5)}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !description.trim()}
        className={`w-full bg-[#051429] hover:bg-[#0c2447] text-white font-bold transition-colors shadow-md shadow-[#051429]/10 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${isMobile ? 'py-2 rounded-lg text-xs' : 'py-2.5 px-4 rounded-xl text-xs'}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Enviando reporte…
          </>
        ) : (
          'Enviar Alerta al Ayuntamiento'
        )}
      </button>
    </form>
  );

  return (
    <div className="relative w-full h-[650px] overflow-hidden bg-slate-100 flex flex-col justify-end md:justify-center">

      {/* ── Map zone ── */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer
          key="adn-municipal-incident-map"
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Temporary placement marker */}
          {selectedCoords && (
            <Marker position={[selectedCoords.lat, selectedCoords.lng]} icon={createCustomIcon('#051429')}>
              <Popup>
                <span className="text-xs font-bold text-[#051429]">Reportando punto aquí</span>
              </Popup>
            </Marker>
          )}

          {/* Live incident markers */}
          {incidents.map((incident) => {
            const config = INCIDENT_TYPES[incident.type];
            return (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                icon={createCustomIcon(config.color)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 max-w-[220px]">
                    <div className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: config.color }}>
                      {config.label}
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mb-2">
                      &ldquo;{incident.description}&rdquo;
                    </p>
                    <div className="border-t border-slate-100 pt-1.5 text-[9px] text-slate-400 font-mono">
                      {incident.date.toLocaleDateString('es-DO')} | ID: {incident.id.slice(0, 8)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── Desktop floating card ── */}
      <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="w-full max-w-[390px] p-6 bg-white/95 backdrop-blur-md shadow-2xl shadow-[#051429]/10 border border-slate-200/80 rounded-2xl pointer-events-auto flex flex-col hidden md:flex transition-all duration-300">

            {/* Map error state */}
            {mapError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error cargando el mapa</p>
                  <p className="mt-0.5 text-red-600">{mapError}</p>
                  <button onClick={fetchIncidents} className="mt-1.5 font-bold underline">Reintentar</button>
                </div>
              </div>
            )}

            {/* Success notification */}
            {showSuccessNotification && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">¡Reporte Enviado!</h4>
                  <p className="text-[11px] text-green-700 mt-0.5">
                    La incidencia se registró con éxito y fue enviada a las cuadrillas de monitoreo municipal.
                  </p>
                </div>
              </div>
            )}

            {!selectedCoords ? (
              <>
                <h2 className="text-2xl font-sans font-black tracking-tight text-[#051429] mb-2 leading-none">
                  Reporte de <br />
                  <span className="text-[#B8902F]">Incidencias Viales</span>
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-5">
                  Ayude a mantener la ciudad limpia y segura. Haga clic directamente en cualquier punto del mapa para reportar una anomalía al Ayuntamiento.
                </p>

                <div className="border-t border-slate-100 pt-4 flex-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    {isLoadingMap ? 'Cargando reportes…' : `Últimos ${incidents.length} reportes del sector`}
                  </span>

                  {isLoadingMap ? (
                    <div className="space-y-2.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start animate-pulse">
                          <div className="w-7 h-7 bg-slate-200 rounded-lg flex-shrink-0" />
                          <div className="flex-1">
                            <div className="h-3 bg-slate-200 rounded w-3/4 mb-1.5" />
                            <div className="h-2.5 bg-slate-100 rounded w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {incidents.map((inc) => {
                        const TypeIcon = INCIDENT_TYPES[inc.type].icon;
                        return (
                          <div key={inc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start">
                            <div
                              className="p-1.5 rounded-lg text-white mt-0.5 flex-shrink-0"
                              style={{ backgroundColor: INCIDENT_TYPES[inc.type].color }}
                            >
                              <TypeIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-[#051429]">{INCIDENT_TYPES[inc.type].label}</span>
                              <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{inc.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : renderForm(false)}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom bar ── */}
      <div className="md:hidden relative z-[1000] w-full p-4 bg-white border-t border-slate-200 pointer-events-auto flex flex-col">
        {selectedCoords ? (
          renderForm(true)
        ) : (
          <div className="text-center py-2">
            <p className="text-xs font-bold text-[#051429]">
              {showSuccessNotification
                ? '✅ ¡Reporte enviado con éxito!'
                : '📍 Toque cualquier punto del mapa para reportar'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};