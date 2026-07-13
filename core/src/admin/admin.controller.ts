import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard, ROLES_KEY } from './auth/auth.guard';
import { AdminService } from './admin.service';
import { RolUsuario } from './entities/usuario.entity';

const SoloEditor = () => SetMetadata(ROLES_KEY, [RolUsuario.EDITOR]);

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // PERMISOS
  @Get('permisos')
  listarPermisos() {
    return this.adminService.listarPermisos();
  }

  @SoloEditor()
  @Patch('permisos/:id/estado')
  cambiarEstadoPermiso(
    @Param('id') id: string,
    @Body('nuevo_estado') estado: string,
  ) {
    return this.adminService.cambiarEstadoPermiso(id, estado);
  }

  @SoloEditor()
  @Patch('permisos/:id/deshabilitar')
  deshabilitarPermiso(@Param('id') id: string) {
    return this.adminService.deshabilitarPermiso(id);
  }

  // INMUEBLES
  @Get('inmuebles')
  listarInmuebles() {
    return this.adminService.listarInmuebles();
  }

  @SoloEditor()
  @Patch('inmuebles/:id/deshabilitar')
  deshabilitarInmueble(@Param('id') id: string) {
    return this.adminService.deshabilitarInmueble(id);
  }

  // FACTURAS
  @Get('facturas')
  listarFacturas() {
    return this.adminService.listarFacturas();
  }

  // INCIDENCIAS
  @Get('incidencias')
  listarIncidencias() {
    return this.adminService.listarIncidencias();
  }

  @SoloEditor()
  @Patch('incidencias/:id/estado')
  cambiarEstadoIncidencia(
    @Param('id') id: string,
    @Body('nuevo_estado') estado: string,
  ) {
    return this.adminService.cambiarEstadoIncidencia(id, estado);
  }

  // FOSAS
  @Get('fosas')
  listarFosas() {
    return this.adminService.listarFosas();
  }

  @SoloEditor()
  @Patch('fosas/:id/deshabilitar')
  deshabilitarFosa(@Param('id') id: string) {
    return this.adminService.deshabilitarFosa(id);
  }

  // HISTORIAL DE PAGOS
  @Get('pagos')
  listarPagos() {
    return this.adminService.listarPagos();
  }
}
