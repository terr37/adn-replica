import { apiClient } from '../../../core/infrastructure/apiClient';
import { IAseoService, IncidenciaVialEntity, InmuebleEntity, TipoIncidencia } from '../domain/AseoEntities';

export class AseoApiService implements IAseoService {
  async obtenerCatastro(): Promise<InmuebleEntity[]> {
    const response = await apiClient.get<InmuebleEntity[]>('/aseo/catastro');
    return response.data;
  }

  async obtenerIncidencias(): Promise<IncidenciaVialEntity[]> {
    const response = await apiClient.get<IncidenciaVialEntity[]>('/aseo/incidencias');
    return response.data;
  }

  async reportarIncidencia(lat: number, lng: number, tipo: TipoIncidencia, titulo: string): Promise<IncidenciaVialEntity> {
    const response = await apiClient.post<IncidenciaVialEntity>('/aseo/incidencias', { lat, lng, tipo, titulo });
    return response.data;
  }
}
