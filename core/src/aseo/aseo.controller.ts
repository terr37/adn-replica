import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { AseoService } from './aseo.service';
import { CrearInmuebleDto } from './dto/crear-inmueble.dto';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';
import { CambiarEstadoIncidenciaDto } from './dto/cambiar-estado-incidencia.dto';

@Controller('aseo')
export class AseoController {
  constructor(private readonly service: AseoService) {}

  @Post('inmuebles')
  crearInmueble(@Body() dto: CrearInmuebleDto) {
    return this.service.crearInmueble(dto);
  }

  @Get('inmuebles')
  listarInmuebles() {
    return this.service.listarInmuebles();
  }

  @Get('inmuebles/:id')
  buscarInmueble(@Param('id') id: string) {
    return this.service.buscarInmueble(id);
  }

  @Post('inmuebles/:id/facturas')
  generarFactura(@Param('id') id: string, @Body('mes_facturado') mes: string) {
    return this.service.generarFactura(id, mes);
  }

  @Get('inmuebles/:id/facturas')
  listarFacturas(@Param('id') id: string) {
    return this.service.listarFacturas(id);
  }

  @Post('incidencias')
  crearIncidencia(@Body() dto: CrearIncidenciaDto) {
    return this.service.crearIncidencia(dto);
  }

  @Get('incidencias')
  listarIncidencias() {
    return this.service.listarIncidencias();
  }

  @Patch('incidencias/:id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoIncidenciaDto,
  ) {
    return this.service.cambiarEstadoIncidencia(id, dto.nuevo_estado);
  }
}
