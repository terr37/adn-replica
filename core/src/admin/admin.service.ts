import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Permiso,
  EstadoPermiso,
} from '../planeamiento/entities/permiso.entity';
import { Inmueble } from '../aseo/entities/inmueble.entity';
import { Factura, EstadoFactura } from '../aseo/entities/factura.entity';
import {
  Incidencia,
  EstadoIncidencia,
} from '../aseo/entities/incidencia.entity';
import { Fosa } from '../servicios-publicos/entities/fosa.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
    @InjectRepository(Inmueble)
    private readonly inmuebleRepo: Repository<Inmueble>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
    @InjectRepository(Fosa)
    private readonly fosaRepo: Repository<Fosa>,
  ) {}

  // PERMISOS
  private readonly transicionesValidas: Record<EstadoPermiso, EstadoPermiso[]> =
    {
      [EstadoPermiso.CREADO]: [EstadoPermiso.EN_REVISION],
      [EstadoPermiso.EN_REVISION]: [
        EstadoPermiso.PENDIENTE_PAGO,
        EstadoPermiso.RECHAZADO,
      ],
      [EstadoPermiso.PENDIENTE_PAGO]: [EstadoPermiso.COMPLETADO],
      [EstadoPermiso.COMPLETADO]: [],
      [EstadoPermiso.RECHAZADO]: [],
    };

  async listarPermisos() {
    return this.permisoRepo.find({ order: { creado_en: 'DESC' } });
  }

  async cambiarEstadoPermiso(id: string, nuevoEstado: string) {
    const permiso = await this.permisoRepo.findOne({ where: { id } });
    if (!permiso) throw new NotFoundException(`Permiso ${id} no encontrado`);

    const estadosPermitidos = this.transicionesValidas[permiso.estado];
    if (!estadosPermitidos.includes(nuevoEstado as EstadoPermiso)) {
      throw new BadRequestException(
        `No se puede transicionar de ${permiso.estado} a ${nuevoEstado}`,
      );
    }

    permiso.estado = nuevoEstado as EstadoPermiso;
    return this.permisoRepo.save(permiso);
  }

  async deshabilitarPermiso(id: string) {
    const permiso = await this.permisoRepo.findOne({ where: { id } });
    if (!permiso) throw new NotFoundException(`Permiso ${id} no encontrado`);
    permiso.activo = false;
    return this.permisoRepo.save(permiso);
  }

  // INMUEBLES
  async listarInmuebles() {
    return this.inmuebleRepo.find({ order: { registrado_en: 'DESC' } });
  }

  async deshabilitarInmueble(id: string) {
    const inmueble = await this.inmuebleRepo.findOne({ where: { id } });
    if (!inmueble) throw new NotFoundException(`Inmueble ${id} no encontrado`);
    inmueble.activo = false;
    return this.inmuebleRepo.save(inmueble);
  }

  // FACTURAS
  async listarFacturas() {
    return this.facturaRepo.find({ order: { creado_en: 'DESC' } });
  }

  // INCIDENCIAS
  async listarIncidencias() {
    return this.incidenciaRepo.find({ order: { creado_en: 'DESC' } });
  }

  async cambiarEstadoIncidencia(id: string, nuevoEstado: string) {
    const incidencia = await this.incidenciaRepo.findOne({ where: { id } });
    if (!incidencia)
      throw new NotFoundException(`Incidencia ${id} no encontrada`);
    incidencia.estado = nuevoEstado as EstadoIncidencia;
    return this.incidenciaRepo.save(incidencia);
  }

  // FOSAS
  async listarFosas() {
    return this.fosaRepo.find({ order: { registrado_en: 'DESC' } });
  }

  async deshabilitarFosa(id: string) {
    const fosa = await this.fosaRepo.findOne({ where: { id } });
    if (!fosa) throw new NotFoundException(`Fosa ${id} no encontrada`);
    fosa.activo = false;
    return this.fosaRepo.save(fosa);
  }

  // PAGOS
  async listarPagos() {
    return this.facturaRepo.find({
      where: { estado: EstadoFactura.PAGADA },
      order: { creado_en: 'DESC' },
    });
  }
}
