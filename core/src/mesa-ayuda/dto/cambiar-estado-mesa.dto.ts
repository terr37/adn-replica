import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoIncidencia } from '../../aseo/entities/incidencia.entity';

export class CambiarEstadoMesaDto {
  @IsEnum(EstadoIncidencia)
  @IsNotEmpty()
  nuevo_estado!: EstadoIncidencia;
}
