import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Incidencia,
  EstadoIncidencia,
} from '../aseo/entities/incidencia.entity';

@Injectable()
export class MesaAyudaService {
  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
  ) {}

  async listarIncidenciasAbiertas(): Promise<Incidencia[]> {
    return this.incidenciaRepo.find({
      where: [
        { estado: EstadoIncidencia.ABIERTO },
        { estado: EstadoIncidencia.EN_PROCESO },
      ],
      order: { creado_en: 'DESC' },
    });
  }

  async cambiarEstado(
    id: string,
    nuevoEstado: EstadoIncidencia,
  ): Promise<Incidencia> {
    const incidencia = await this.incidenciaRepo.findOne({ where: { id } });
    if (!incidencia)
      throw new NotFoundException(`Incidencia ${id} no encontrada`);
    incidencia.estado = nuevoEstado;
    return this.incidenciaRepo.save(incidencia);
  }
}
