import { IsString, IsNotEmpty } from 'class-validator';

export class CrearFosaDto {
  @IsString()
  @IsNotEmpty()
  codigo_fosa!: string;

  @IsString()
  @IsNotEmpty()
  seccion!: string;
}
