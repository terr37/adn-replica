import { useState, useCallback, useEffect } from 'react';
import { EstadoIncidencia } from '../../../aseo/domain/AseoEntities';
import { TicketMesaAyudaEntity } from '../../domain/TicketEntity';
import { getHelpdeskService } from '../../infrastructure/HelpdeskFactory';

const TICKET_STATE_ORDER: Record<EstadoIncidencia, number> = {
  'ABIERTO': 1,
  'EN_PROCESO': 2,
  'RESUELTO': 3
};

export const useMesaAyuda = () => {
  const [tickets, setTickets] = useState<TicketMesaAyudaEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getHelpdeskService();

  const cargarTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: EstadoIncidencia) => {
    const ticketActual = tickets.find(t => t.id === id);
    if (!ticketActual) {
      const errMsg = 'Ticket no encontrado localmente';
      setError(errMsg);
      throw new Error(errMsg);
    }

    const currentOrder = TICKET_STATE_ORDER[ticketActual.estado];
    const newOrder = TICKET_STATE_ORDER[nuevoEstado];

    // Basic linear validation
    if (newOrder <= currentOrder) {
      const errMsg = `Transición inválida: El ticket ya está en estado ${ticketActual.estado}`;
      setError(errMsg);
      throw new Error(errMsg);
    }

    setIsLoading(true);
    setError(null);
    try {
      const actualizado = await service.actualizarEstado(id, nuevoEstado);
      setTickets(prev => prev.map(t => t.id === id ? actualizado : t));
      return actualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el ticket');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, [cargarTickets]);

  return { tickets, isLoading, error, actualizarEstado, cargarTickets };
};
