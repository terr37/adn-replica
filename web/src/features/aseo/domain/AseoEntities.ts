export type TipoInmueble = 'Residencial' | 'Comercial';

export interface InmuebleEntity {
  id: string;
  direccion: string;
  zona: 'Piantini' | 'Gazcue' | 'Zona Colonial';
  lat: number;
  lng: number;
  tipoUso: TipoInmueble;
  tarifaMensual?: number; // Calculated dynamically or returned by backend
}

export type TipoIncidencia = 'bache' | 'basura';
export type EstadoIncidencia = 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO';

export interface IncidenciaVialEntity {
  id: string;
  titulo: string;
  tipo: TipoIncidencia;
  lat: number;
  lng: number;
  estado: EstadoIncidencia;
  fechaReporte: string;
}

export interface IAseoService {
  obtenerCatastro(): Promise<InmuebleEntity[]>;
  obtenerIncidencias(): Promise<IncidenciaVialEntity[]>;
  reportarIncidencia(lat: number, lng: number, tipo: TipoIncidencia, titulo: string): Promise<IncidenciaVialEntity>;
}
