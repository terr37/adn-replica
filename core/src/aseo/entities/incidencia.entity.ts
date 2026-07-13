import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoIncidencia {
  BACHE = 'BACHE',
  VERTEDERO_CLANDESTINO = 'VERTEDERO_CLANDESTINO',
}

export enum EstadoIncidencia {
  ABIERTO = 'ABIERTO',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
}

@Entity('incidencias_viales')
export class Incidencia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TipoIncidencia })
  tipo!: TipoIncidencia;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud!: number;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: EstadoIncidencia,
    default: EstadoIncidencia.ABIERTO,
  })
  estado!: EstadoIncidencia;

  @Column({ nullable: true })
  reportado_por!: string;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
