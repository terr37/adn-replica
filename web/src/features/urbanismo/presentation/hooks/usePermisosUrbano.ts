import { useState, useCallback, useEffect } from 'react';
import { PermisoConstruccionEntity, PermisoEstado } from '../../domain/PermisoConstruccionEntity';
import { getUrbanismoService } from '../../infrastructure/UrbanismoFactory';

const STATE_MACHINE_ORDER: Record<PermisoEstado, number> = {
  'CREADO': 1,
  'EN_REVISION': 2,
  'PENDIENTE_PAGO': 3,
  'COMPLETADO': 4,
  'RECHAZADO': 4 // Terminal alternate state
};

export const usePermisosUrbano = () => {
  const [solicitudes, setSolicitudes] = useState<PermisoConstruccionEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getUrbanismoService();

  const cargarSolicitudes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.obtenerSolicitudes();
      setSolicitudes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearSolicitud = async (metadata: Omit<PermisoConstruccionEntity, 'id' | 'status' | 'progreso'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevaSolicitud = await service.crearSolicitud(metadata);
      setSolicitudes(prev => [nuevaSolicitud, ...prev]);
      return nuevaSolicitud;
    } catch (err: any) {
      setError(err.message || 'Error al crear la solicitud');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: PermisoEstado) => {
    const solicitudActual = solicitudes.find(s => s.id === id);
    if (!solicitudActual) {
      const errMsg = 'Solicitud no encontrada localmente';
      setError(errMsg);
      throw new Error(errMsg);
    }

    // Client-side linear state machine validation
    const currentOrder = STATE_MACHINE_ORDER[solicitudActual.status];
    const newOrder = STATE_MACHINE_ORDER[nuevoEstado];

    if (nuevoEstado !== 'RECHAZADO' && newOrder !== currentOrder + 1) {
      const errMsg = `Transición de estado inválida: No se puede pasar de ${solicitudActual.status} a ${nuevoEstado}`;
      setError(errMsg);
      throw new Error(errMsg);
    }

    setIsLoading(true);
    setError(null);
    try {
      const actualizada = await service.cambiarEstado(id, nuevoEstado);
      setSolicitudes(prev => prev.map(s => s.id === id ? actualizada : s));
      return actualizada;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Auto-load on mount
  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  return {
    solicitudes,
    isLoading,
    error,
    crearSolicitud,
    cambiarEstado,
    cargarSolicitudes
  };
};
