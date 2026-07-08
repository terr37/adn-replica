import { useState, useCallback, useEffect } from 'react';
import { InmuebleEntity } from '../../domain/AseoEntities';
import { getAseoService } from '../../infrastructure/AseoFactory';

export const useCatastroSemilla = () => {
  const [inmuebles, setInmuebles] = useState<InmuebleEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getAseoService();

  const cargarCatastro = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.obtenerCatastro();
      setInmuebles(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el catastro semilla');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCatastro();
  }, [cargarCatastro]);

  return { inmuebles, isLoading, error, cargarCatastro };
};
