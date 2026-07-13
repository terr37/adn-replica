import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { TipoUso } from '../entities/inmueble.entity';

export class CrearInmuebleDto {
  @IsString()
  @IsNotEmpty()
  propietario_nombre!: string;

  @IsString()
  @IsNotEmpty()
  propietario_cedula!: string;

  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @IsString()
  @IsNotEmpty()
  zona!: string;

  @IsEnum(TipoUso)
  tipo_uso!: TipoUso;

  @IsNumber()
  tarifa_mensual!: number;
}
