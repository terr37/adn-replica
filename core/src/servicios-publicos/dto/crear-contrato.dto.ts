import { IsString, IsNotEmpty } from 'class-validator';

export class CrearContratoDto {
  @IsString()
  @IsNotEmpty()
  comprador_nombre!: string;

  @IsString()
  @IsNotEmpty()
  comprador_cedula!: string;

  @IsString()
  @IsNotEmpty()
  descripcion_bien!: string;

  @IsString()
  @IsNotEmpty()
  monto!: string;
}
