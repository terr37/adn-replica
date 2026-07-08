import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

export enum EstadoFactura {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
}

@Entity('facturas_aseo')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne('Inmueble', 'facturas')
  inmueble!: unknown;

  @Column()
  inmueble_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Column()
  mes_facturado!: string;

  @Column({
    type: 'enum',
    enum: EstadoFactura,
    default: EstadoFactura.PENDIENTE,
  })
  estado!: EstadoFactura;

  @Column({ nullable: true })
  transaccion_id!: string;

  @CreateDateColumn()
  creado_en!: Date;
}
