import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inmueble } from './entities/inmueble.entity';
import { Factura, EstadoFactura } from './entities/factura.entity';
import { Incidencia, EstadoIncidencia } from './entities/incidencia.entity';
import { CrearInmuebleDto } from './dto/crear-inmueble.dto';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';

@Injectable()
export class AseoService {
  constructor(
    @InjectRepository(Inmueble)
    private readonly inmuebleRepo: Repository<Inmueble>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
  ) {}

  // INMUEBLES
  async crearInmueble(dto: CrearInmuebleDto): Promise<Inmueble> {
    const inmueble = this.inmuebleRepo.create(dto);
    return this.inmuebleRepo.save(inmueble);
  }

  async listarInmuebles(): Promise<Inmueble[]> {
    return this.inmuebleRepo.find({ order: { registrado_en: 'DESC' } });
  }

  async buscarInmueble(id: string): Promise<Inmueble> {
    const inmueble = await this.inmuebleRepo.findOne({ where: { id } });
    if (!inmueble) throw new NotFoundException(`Inmueble ${id} no encontrado`);
    return inmueble;
  }

  // FACTURAS
  async generarFactura(
    inmueble_id: string,
    mes_facturado: string,
  ): Promise<Factura> {
    const inmueble = await this.buscarInmueble(inmueble_id);
    const factura = this.facturaRepo.create({
      inmueble_id,
      monto: inmueble.tarifa_mensual,
      mes_facturado,
      estado: EstadoFactura.PENDIENTE,
    });
    return this.facturaRepo.save(factura);
  }

  async listarFacturas(inmueble_id: string): Promise<Factura[]> {
    return this.facturaRepo.find({
      where: { inmueble_id },
      order: { creado_en: 'DESC' },
    });
  }

  // INCIDENCIAS
  async crearIncidencia(dto: CrearIncidenciaDto): Promise<Incidencia> {
    const incidencia = this.incidenciaRepo.create(dto);
    return this.incidenciaRepo.save(incidencia);
  }

  async listarIncidencias(): Promise<Incidencia[]> {
    return this.incidenciaRepo.find({ order: { creado_en: 'DESC' } });
  }

  async cambiarEstadoIncidencia(
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
