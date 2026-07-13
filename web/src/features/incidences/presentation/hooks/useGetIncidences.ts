'use client';

import { useState, useEffect } from 'react';
import { IncidentEntity } from '../../domain/IncidentEntity';

const MOCK_INCIDENTS: IncidentEntity[] = [
  { id: '1', lat: 18.4861, lng: -69.9312, type: 'obra', title: 'Reparación de Vía Principal' },
  { id: '2', lat: 18.4900, lng: -69.9200, type: 'mantenimiento', title: 'Poda de Árboles' },
  { id: '3', lat: 18.4750, lng: -69.9400, type: 'obra', title: 'Construcción de Parque' },
  { id: '4', lat: 18.4800, lng: -69.9100, type: 'mantenimiento', title: 'Limpieza de Imbornales' },
];

export const useGetIncidences = () => {
  const [data, setData] = useState<IncidentEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_INCIDENTS);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
