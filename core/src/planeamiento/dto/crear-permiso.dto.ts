import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum TipoPermiso {
  CONSTRUCCION = 'CONSTRUCCION',
  DEMOLICION = 'DEMOLICION',
}

export class CrearPermisoDto {
  @IsString()
  @IsNotEmpty()
  solicitante_nombre!: string;

  @IsString()
  @IsNotEmpty()
  solicitante_cedula!: string;

  @IsEnum(TipoPermiso)
  tipo_permiso!: TipoPermiso;

  @IsOptional()
  @IsString()
  metadata_plano_id?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
