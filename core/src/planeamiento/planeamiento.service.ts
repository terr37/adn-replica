import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso, EstadoPermiso } from './entities/permiso.entity';
import { CrearPermisoDto } from './dto/crear-permiso.dto';

@Injectable()
export class PlaneamientoService {
  // Mapa de transiciones válidas — Máquina de estados lineal
  private readonly transicionesValidas: Record<EstadoPermiso, EstadoPermiso[]> =
    {
      [EstadoPermiso.CREADO]: [EstadoPermiso.EN_REVISION],
      [EstadoPermiso.EN_REVISION]: [
        EstadoPermiso.PENDIENTE_PAGO,
        EstadoPermiso.RECHAZADO,
      ],
      [EstadoPermiso.PENDIENTE_PAGO]: [EstadoPermiso.COMPLETADO],
      [EstadoPermiso.COMPLETADO]: [], // Estado terminal
      [EstadoPermiso.RECHAZADO]: [], // Estado terminal
    };

  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  async crear(dto: CrearPermisoDto): Promise<Permiso> {
    const permiso = this.permisoRepo.create(dto);
    return this.permisoRepo.save(permiso);
  }

  async listar(): Promise<Permiso[]> {
    return this.permisoRepo.find({ order: { creado_en: 'DESC' } });
  }

  async buscarPorId(id: string): Promise<Permiso> {
    const permiso = await this.permisoRepo.findOne({ where: { id } });
    if (!permiso)
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    return permiso;
  }

  async cambiarEstado(
    id: string,
    nuevoEstado: EstadoPermiso,
  ): Promise<Permiso> {
    const permiso = await this.buscarPorId(id);
    const estadosPermitidos = this.transicionesValidas[permiso.estado];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `La solicitud no puede transicionar de ${permiso.estado} a ${nuevoEstado}.`,
      );
    }

    permiso.estado = nuevoEstado;
    return this.permisoRepo.save(permiso);
  }
}
