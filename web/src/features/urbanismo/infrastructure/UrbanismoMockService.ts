import { IPermisoUrbanoService, PermisoConstruccionEntity, PermisoEstado } from '../domain/PermisoConstruccionEntity';

let mockDatabase: PermisoConstruccionEntity[] = [
  { id: 'URB-001', titulo: 'Torre Residencial Piantini', solicitante: 'Constructora Beta', fecha: '2026-06-15', progreso: 25, status: 'CREADO' },
  { id: 'URB-002', titulo: 'Plaza Comercial Gazcue', solicitante: 'Inversiones Alfa', fecha: '2026-06-10', progreso: 50, status: 'EN_REVISION' },
];

export class UrbanismoMockService implements IPermisoUrbanoService {
  async crearSolicitud(metadata: Omit<PermisoConstruccionEntity, 'id' | 'status' | 'progreso'>): Promise<PermisoConstruccionEntity> {
    const newPermiso: PermisoConstruccionEntity = {
      ...metadata,
      id: `URB-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'CREADO',
      progreso: 10,
    };
    mockDatabase = [newPermiso, ...mockDatabase];
    return Promise.resolve(newPermiso);
  }

  async cambiarEstado(id: string, nuevoEstado: PermisoEstado): Promise<PermisoConstruccionEntity> {
    const index = mockDatabase.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject({ status_code: 404, message: 'Permiso no encontrado' });
    }

    let progreso = mockDatabase[index].progreso;
    switch (nuevoEstado) {
      case 'EN_REVISION': progreso = 50; break;
      case 'PENDIENTE_PAGO': progreso = 75; break;
      case 'COMPLETADO': progreso = 100; break;
      case 'RECHAZADO': progreso = 100; break;
      case 'CREADO': progreso = 25; break;
    }

    mockDatabase[index] = { ...mockDatabase[index], status: nuevoEstado, progreso };
    return Promise.resolve(mockDatabase[index]);
  }

  async obtenerSolicitudes(): Promise<PermisoConstruccionEntity[]> {
    return Promise.resolve([...mockDatabase]);
  }
}
