import { apiClient } from '../../../core/infrastructure/apiClient';
import { IPermisoUrbanoService, PermisoConstruccionEntity, PermisoEstado } from '../domain/PermisoConstruccionEntity';

export class UrbanismoApiService implements IPermisoUrbanoService {
  async crearSolicitud(metadata: Omit<PermisoConstruccionEntity, 'id' | 'status' | 'progreso'>): Promise<PermisoConstruccionEntity> {
    const response = await apiClient.post<PermisoConstruccionEntity>('/urbanismo/permisos', metadata);
    return response.data;
  }

  async cambiarEstado(id: string, nuevoEstado: PermisoEstado): Promise<PermisoConstruccionEntity> {
    const response = await apiClient.put<PermisoConstruccionEntity>(`/urbanismo/permisos/${id}/estado`, { status: nuevoEstado });
    return response.data;
  }

  async obtenerSolicitudes(): Promise<PermisoConstruccionEntity[]> {
    const response = await apiClient.get<PermisoConstruccionEntity[]>('/urbanismo/permisos');
    return response.data;
  }
}
