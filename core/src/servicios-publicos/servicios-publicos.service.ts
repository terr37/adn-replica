import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fosa, EstadoFosa } from './entities/fosa.entity';
import { CrearFosaDto } from './dto/crear-fosa.dto';
import { VenderFosaDto } from './dto/vender-fosa.dto';
import { CrearContratoDto } from './dto/crear-contrato.dto';

@Injectable()
export class ServiciosPublicosService {
  constructor(
    @InjectRepository(Fosa)
    private readonly fosaRepo: Repository<Fosa>,
  ) {}

  // CEMENTERIOS
  async crearFosa(dto: CrearFosaDto): Promise<Fosa> {
    const fosa = this.fosaRepo.create(dto);
    return this.fosaRepo.save(fosa);
  }

  async listarFosas(): Promise<Fosa[]> {
    return this.fosaRepo.find({ order: { registrado_en: 'DESC' } });
  }

  async buscarFosa(id: string): Promise<Fosa> {
    const fosa = await this.fosaRepo.findOne({ where: { id } });
    if (!fosa) throw new NotFoundException(`Fosa ${id} no encontrada`);
    return fosa;
  }

  async venderFosa(id: string, dto: VenderFosaDto): Promise<Fosa> {
    const fosa = await this.buscarFosa(id);

    if (fosa.estado === EstadoFosa.OCUPADA) {
      throw new BadRequestException(
        `La fosa ${fosa.codigo_fosa} ya está ocupada. Esta transición es irreversible.`,
      );
    }

    fosa.estado = EstadoFosa.OCUPADA;
    fosa.titular_nombre = dto.titular_nombre;
    fosa.titular_cedula = dto.titular_cedula;
    fosa.fecha_venta = dto.fecha_venta;

    return this.fosaRepo.save(fosa);
  }

  // REGISTRO CIVIL
  generarContrato(dto: CrearContratoDto): object {
    return {
      contrato_id: `CONT-${Date.now()}`,
      tipo: 'VENTA_CONDICIONAL',
      comprador_nombre: dto.comprador_nombre,
      comprador_cedula: dto.comprador_cedula,
      descripcion_bien: dto.descripcion_bien,
      monto: dto.monto,
      moneda: 'DOP',
      fecha_generacion: new Date().toISOString(),
      estado: 'GENERADO',
      nota: 'Contrato base simulado — sin tramitología legal real.',
    };
  }
}
