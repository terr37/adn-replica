import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ServiciosPublicosService } from './servicios-publicos.service';
import { CrearFosaDto } from './dto/crear-fosa.dto';
import { VenderFosaDto } from './dto/vender-fosa.dto';
import { CrearContratoDto } from './dto/crear-contrato.dto';

@Controller('servicios-publicos')
export class ServiciosPublicosController {
  constructor(private readonly service: ServiciosPublicosService) {}

  // CEMENTERIOS
  @Post('fosas')
  crearFosa(@Body() dto: CrearFosaDto) {
    return this.service.crearFosa(dto);
  }

  @Get('fosas')
  listarFosas() {
    return this.service.listarFosas();
  }

  @Get('fosas/:id')
  buscarFosa(@Param('id') id: string) {
    return this.service.buscarFosa(id);
  }

  @Post('fosas/:id/vender')
  venderFosa(@Param('id') id: string, @Body() dto: VenderFosaDto) {
    return this.service.venderFosa(id, dto);
  }

  // REGISTRO CIVIL
  @Post('registro-civil/contrato')
  generarContrato(@Body() dto: CrearContratoDto) {
    return this.service.generarContrato(dto);
  }
}
