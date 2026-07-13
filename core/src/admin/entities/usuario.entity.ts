import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  SOLO_LECTURA = 'SOLO_LECTURA',
  EDITOR = 'EDITOR',
}

@Entity('usuarios_admin')
export class UsuarioAdmin {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol!: RolUsuario;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;
}
