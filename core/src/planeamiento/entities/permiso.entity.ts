import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoPermiso {
  CREADO = 'CREADO',
  EN_REVISION = 'EN_REVISION',
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
}

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  solicitante_nombre!: string;

  @Column()
  solicitante_cedula!: string;

  @Column({ type: 'enum', enum: EstadoPermiso, default: EstadoPermiso.CREADO })
  estado!: EstadoPermiso;

  @Column({ default: 'CONSTRUCCION' })
  tipo_permiso!: string; // CONSTRUCCION o DEMOLICION

  @Column({ nullable: true })
  metadata_plano_id!: string; // ID simulado del plano (sin servidor de archivos real)

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
