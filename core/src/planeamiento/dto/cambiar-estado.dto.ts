import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoPermiso } from '../entities/permiso.entity';

export class CambiarEstadoDto {
  @IsEnum(EstadoPermiso)
  @IsNotEmpty()
  nuevo_estado!: EstadoPermiso;
}
