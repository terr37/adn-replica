export type PermisoEstado = 'CREADO' | 'EN_REVISION' | 'PENDIENTE_PAGO' | 'COMPLETADO' | 'RECHAZADO';

export interface PermisoConstruccionEntity {
  id: string;
  titulo: string;
  solicitante: string;
  fecha: string;
  progreso: number; // 0 to 100
  status: PermisoEstado;
}

export interface IPermisoUrbanoService {
  crearSolicitud(metadata: Omit<PermisoConstruccionEntity, 'id' | 'status' | 'progreso'>): Promise<PermisoConstruccionEntity>;
  cambiarEstado(id: string, nuevoEstado: PermisoEstado): Promise<PermisoConstruccionEntity>;
  obtenerSolicitudes(): Promise<PermisoConstruccionEntity[]>;
}
