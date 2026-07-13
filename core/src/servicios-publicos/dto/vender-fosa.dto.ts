import { IsString, IsNotEmpty } from 'class-validator';

export class VenderFosaDto {
  @IsString()
  @IsNotEmpty()
  titular_nombre!: string;

  @IsString()
  @IsNotEmpty()
  titular_cedula!: string;

  @IsString()
  @IsNotEmpty()
  fecha_venta!: string;
}
