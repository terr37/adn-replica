import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { PlaneamientoService } from './planeamiento.service';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Controller('planeamiento/permisos')
export class PlaneamientoController {
  constructor(private readonly service: PlaneamientoService) {}

  @Post()
  crear(@Body() dto: CrearPermisoDto) {
    return this.service.crear(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoDto) {
    return this.service.cambiarEstado(id, dto.nuevo_estado);
  }
}
