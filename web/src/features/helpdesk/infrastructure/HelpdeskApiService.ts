import { apiClient } from '../../../core/infrastructure/apiClient';
import { EstadoIncidencia } from '../../aseo/domain/AseoEntities';
import { IHelpdeskService, TicketMesaAyudaEntity } from '../domain/TicketEntity';

export class HelpdeskApiService implements IHelpdeskService {
  async obtenerTickets(): Promise<TicketMesaAyudaEntity[]> {
    const response = await apiClient.get<TicketMesaAyudaEntity[]>('/helpdesk/tickets');
    return response.data;
  }

  async actualizarEstado(id: string, nuevoEstado: EstadoIncidencia): Promise<TicketMesaAyudaEntity> {
    const response = await apiClient.patch<TicketMesaAyudaEntity>(`/helpdesk/tickets/${id}/estado`, { estado: nuevoEstado });
    return response.data;
  }
}
