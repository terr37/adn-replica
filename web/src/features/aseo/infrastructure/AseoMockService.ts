import { IAseoService, IncidenciaVialEntity, InmuebleEntity, TipoIncidencia } from '../domain/AseoEntities';

// Catastro Semilla: 20 ficticious properties
const catastroSemilla: InmuebleEntity[] = Array.from({ length: 20 }).map((_, i) => {
  const isResidencial = Math.random() > 0.3;
  const zonas: Array<'Piantini' | 'Gazcue' | 'Zona Colonial'> = ['Piantini', 'Gazcue', 'Zona Colonial'];
  const zona = zonas[Math.floor(Math.random() * zonas.length)];

  return {
    id: `INM-${(i + 1).toString().padStart(5, '0')}`,
    direccion: `Calle Ficticia ${i + 1}, ${zona}`,
    zona,
    lat: 18.4861 + (Math.random() - 0.5) * 0.05,
    lng: -69.9312 + (Math.random() - 0.5) * 0.05,
    tipoUso: isResidencial ? 'Residencial' : 'Comercial',
    // SDP Rule: Residencial = 300, Comercial = 1500
    tarifaMensual: isResidencial ? 300 : 1500,
  };
});

let incidenciasMock: IncidenciaVialEntity[] = [
  { id: 'INC-001', titulo: 'Bache profundo en Lope de Vega', tipo: 'bache', lat: 18.4720, lng: -69.9310, estado: 'ABIERTO', fechaReporte: new Date().toISOString() },
  { id: 'INC-002', titulo: 'Acumulación de basura', tipo: 'basura', lat: 18.4735, lng: -69.9335, estado: 'EN_PROCESO', fechaReporte: new Date().toISOString() }
];

export class AseoMockService implements IAseoService {
  async obtenerCatastro(): Promise<InmuebleEntity[]> {
    return Promise.resolve([...catastroSemilla]);
  }

  async obtenerIncidencias(): Promise<IncidenciaVialEntity[]> {
    return Promise.resolve([...incidenciasMock]);
  }

  async reportarIncidencia(lat: number, lng: number, tipo: TipoIncidencia, titulo: string): Promise<IncidenciaVialEntity> {
    const nuevaIncidencia: IncidenciaVialEntity = {
      id: `INC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      titulo,
      tipo,
      lat,
      lng,
      estado: 'ABIERTO',
      fechaReporte: new Date().toISOString()
    };
    incidenciasMock = [nuevaIncidencia, ...incidenciasMock];
    return Promise.resolve(nuevaIncidencia);
  }
}
