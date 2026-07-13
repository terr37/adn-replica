import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum EstadoFosa {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADA = 'OCUPADA',
}

@Entity('fosas')
export class Fosa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  codigo_fosa!: string;

  @Column()
  seccion!: string;

  @Column({ type: 'enum', enum: EstadoFosa, default: EstadoFosa.DISPONIBLE })
  estado!: EstadoFosa;

  @Column({ nullable: true })
  titular_nombre!: string;

  @Column({ nullable: true })
  titular_cedula!: string;

  @Column({ nullable: true })
  fecha_venta!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  registrado_en!: Date;
}
