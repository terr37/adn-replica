'use client';

import { useState, useEffect } from 'react';
import { IncidentEntity } from '../../domain/IncidentEntity';
import { obtenerIncidentesMapa, IncidenteMapaItem } from '@/core/infrastructure/apiClient';
import { useAppRefresh } from '@/core/context/AppRefreshContext';

// ============================================================================
// API shape → IncidentEntity mapper
// IncidenteMapaItem uses latitud/longitud and categoria.
// IncidentEntity uses lat/lng and type ('obra' | 'mantenimiento').
// ============================================================================
const CATEGORIA_TYPE_MAP: Record<string, IncidentEntity['type']> = {
  BASURA: 'mantenimiento',
  ARBOL: 'mantenimiento',
  AVERIA: 'obra',
  INCENDIO: 'obra',
};

const mapIncidenteToEntity = (item: IncidenteMapaItem): IncidentEntity => ({
  id: item.incidente_id,
  lat: item.latitud,
  lng: item.longitud,
  type: CATEGORIA_TYPE_MAP[item.categoria.toUpperCase()] ?? 'mantenimiento',
  title: item.titulo,
});

// ============================================================================
// Hook
// Subscribes to incidentVersion so consumers re-render when a new incident
// is reported elsewhere in the app (e.g. from IncidentMap component).
// ============================================================================
export const useGetIncidences = () => {
  const [data, setData] = useState<IncidentEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { incidentVersion } = useAppRefresh();

  useEffect(() => {
    let cancelled = false;

    const fetchIncidences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await obtenerIncidentesMapa();
        if (!cancelled) {
          setData(raw.map(mapIncidenteToEntity));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : (err as { message?: string })?.message ?? 'Error cargando incidencias.';
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchIncidences();
    return () => { cancelled = true; };
    // Re-fetch whenever a new incident is reported anywhere in the app
  }, [incidentVersion]);

  return { data, isLoading, error };
};
