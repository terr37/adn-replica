'use client';

import { useState, useEffect } from 'react';
import { TaxEntity } from '../../domain/TaxEntity';
import { obtenerCatalogoServicios, ServicioCatalogResponse } from '@/core/infrastructure/apiClient';

// ============================================================================
// Category → Lucide icon name mapper
// The API returns a `categoria` string; TaxCard expects a Lucide icon name.
// ============================================================================
const CATEGORY_ICON_MAP: Record<string, string> = {
  construccion: 'Building2',
  ambiental: 'Recycle',
  comercial: 'Store',
  documentos: 'FileCheck',
  vial: 'ShieldAlert',
  parques: 'Trees',
  publicidad: 'Image',
  numeracion: 'MapPin',
};

const mapServicioToTaxEntity = (s: ServicioCatalogResponse): TaxEntity => ({
  id: s.id,
  title: s.nombre,
  description: s.descripcion,
  price: s.monto_base,
  iconName: CATEGORY_ICON_MAP[s.categoria.toLowerCase()] ?? 'FileText',
});

// ============================================================================
// Hook
// ============================================================================
export const useGetCatalog = () => {
  const [data, setData] = useState<TaxEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await obtenerCatalogoServicios();
        if (!cancelled) {
          setData(raw.map(mapServicioToTaxEntity));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : (err as { message?: string })?.message ?? 'Error cargando el catálogo.';
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => { cancelled = true; };
  }, []);

  return { data, isLoading, error };
};
