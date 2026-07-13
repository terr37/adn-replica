import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { MesaAyudaService } from './mesa-ayuda.service';
import { CambiarEstadoMesaDto } from './dto/cambiar-estado-mesa.dto';

@Controller('mesa-ayuda')
export class MesaAyudaController {
  constructor(private readonly service: MesaAyudaService) {}

  @Get('incidencias')
  listarAbiertas() {
    return this.service.listarIncidenciasAbiertas();
  }

  @Patch('incidencias/:id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoMesaDto) {
    return this.service.cambiarEstado(id, dto.nuevo_estado);
  }
}
