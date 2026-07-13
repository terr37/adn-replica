import { useState, useCallback, useEffect } from 'react';
import { IncidenciaVialEntity, TipoIncidencia } from '../../domain/AseoEntities';
import { getAseoService } from '../../infrastructure/AseoFactory';

export const useIncidenciasViales = () => {
  const [incidencias, setIncidencias] = useState<IncidenciaVialEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getAseoService();

  const cargarIncidencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.obtenerIncidencias();
      setIncidencias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las incidencias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reportarIncidenciaVial = async (lat: number, lng: number, tipo: TipoIncidencia, titulo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevaIncidencia = await service.reportarIncidencia(lat, lng, tipo, titulo);
      // Reactive update for the map
      setIncidencias(prev => [nuevaIncidencia, ...prev]);
      return nuevaIncidencia;
    } catch (err: any) {
      setError(err.message || 'Error al reportar la incidencia');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, [cargarIncidencias]);

  return { incidencias, isLoading, error, reportarIncidenciaVial, cargarIncidencias };
};
