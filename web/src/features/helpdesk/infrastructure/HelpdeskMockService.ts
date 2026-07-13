import { EstadoIncidencia } from '../../aseo/domain/AseoEntities';
import { IHelpdeskService, TicketMesaAyudaEntity } from '../domain/TicketEntity';

let mockTickets: TicketMesaAyudaEntity[] = [
  { id: 'INC-001', titulo: 'Bache profundo en Lope de Vega', tipo: 'bache', lat: 18.4720, lng: -69.9310, estado: 'ABIERTO', fechaReporte: new Date(Date.now() - 86400000).toISOString(), ultimaActualizacion: new Date(Date.now() - 86400000).toISOString() },
  { id: 'INC-002', titulo: 'Acumulación de basura', tipo: 'basura', lat: 18.4735, lng: -69.9335, estado: 'EN_PROCESO', asignadoA: 'Brigada 3', fechaReporte: new Date(Date.now() - 172800000).toISOString(), ultimaActualizacion: new Date().toISOString() }
];

export class HelpdeskMockService implements IHelpdeskService {
  async obtenerTickets(): Promise<TicketMesaAyudaEntity[]> {
    return Promise.resolve([...mockTickets]);
  }

  async actualizarEstado(id: string, nuevoEstado: EstadoIncidencia): Promise<TicketMesaAyudaEntity> {
    const index = mockTickets.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject({ status_code: 404, message: 'Ticket no encontrado' });
    }

    mockTickets[index] = { 
      ...mockTickets[index], 
      estado: nuevoEstado, 
      ultimaActualizacion: new Date().toISOString() 
    };
    
    return Promise.resolve(mockTickets[index]);
  }
}
