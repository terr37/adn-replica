import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoIncidencia } from '../entities/incidencia.entity';

export class CambiarEstadoIncidenciaDto {
  @IsEnum(EstadoIncidencia)
  @IsNotEmpty()
  nuevo_estado!: EstadoIncidencia;
}
