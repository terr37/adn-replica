export type PaymentStatus = 'En Revisión' | 'Programado' | 'Requiere acción' | 'Completado';

export interface PaymentEntity {
  id: string;
  referenceId: string;
  title: string;
  date: string;
  progress: number; // 0 to 100
  status: PaymentStatus;
  type: 'document' | 'vehicle' | 'alert';
}
