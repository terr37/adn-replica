import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

export enum TipoUso {
  RESIDENCIAL = 'RESIDENCIAL',
  COMERCIAL = 'COMERCIAL',
}

@Entity('inmuebles')
export class Inmueble {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  propietario_nombre!: string;

  @Column()
  propietario_cedula!: string;

  @Column()
  direccion!: string;

  @Column()
  zona!: string;

  @Column({ type: 'enum', enum: TipoUso })
  tipo_uso!: TipoUso;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tarifa_mensual!: number;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany('Factura', 'inmueble')
  facturas!: unknown[];

  @CreateDateColumn()
  registrado_en!: Date;
}
