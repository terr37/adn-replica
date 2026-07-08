// Note: SDP restricts Helpdesk to incidents reported via Aseo Urbano.
// We can use the existing TipoIncidencia and EstadoIncidencia from Aseo.
import { EstadoIncidencia, TipoIncidencia } from '../../aseo/domain/AseoEntities';

export interface TicketMesaAyudaEntity {
  id: string; // Same as the incidence ID
  titulo: string;
  tipo: TipoIncidencia;
  lat: number;
  lng: number;
  estado: EstadoIncidencia; // ABIERTO -> EN_PROCESO -> RESUELTO
  fechaReporte: string;
  asignadoA?: string;
  ultimaActualizacion: string;
}

export interface IHelpdeskService {
  obtenerTickets(): Promise<TicketMesaAyudaEntity[]>;
  actualizarEstado(id: string, nuevoEstado: EstadoIncidencia): Promise<TicketMesaAyudaEntity>;
}
