import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoIncidencia } from '../entities/incidencia.entity';

export class CrearIncidenciaDto {
  @IsEnum(TipoIncidencia)
  tipo!: TipoIncidencia;

  @IsNumber()
  latitud!: number;

  @IsNumber()
  longitud!: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  reportado_por?: string;
}
