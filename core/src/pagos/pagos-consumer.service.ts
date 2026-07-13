import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Factura, EstadoFactura } from '../aseo/entities/factura.entity';

@Injectable()
export class PagosConsumerService implements OnModuleInit {
  private readonly logger = new Logger(PagosConsumerService.name);
  private redis!: Redis;

  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
    void this.iniciarConsumidor();
  }

  private async iniciarConsumidor() {
    this.logger.log(
      'Consumidor FIFO iniciado — escuchando cola-pagos-municipales',
    );

    while (true) {
      try {
        const resultado = await this.redis.blpop('cola-pagos-municipales', 5);
        if (!resultado) continue;

        const [, mensaje] = resultado;
        await this.procesarPago(JSON.parse(mensaje) as Record<string, unknown>);
      } catch (error) {
        this.logger.error(
          'Error en consumidor de pagos:',
          error instanceof Error ? error.message : String(error),
        );
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  private async procesarPago(pago: Record<string, unknown>) {
    const transaccion_id = pago.transaccion_id as string;
    const inmueble_id = pago.inmueble_id as string;
    const monto = pago.monto as number;
    const mes_facturado =
      (pago.mes_facturado as string) || new Date().toISOString().slice(0, 7);

    // IDEMPOTENCIA: si ya se procesó este UUID, no hacer nada
    const yaExiste = await this.facturaRepo.findOne({
      where: { transaccion_id },
    });

    if (yaExiste) {
      this.logger.warn(`Pago duplicado ignorado: ${transaccion_id}`);
      return;
    }

    const factura = this.facturaRepo.create({
      inmueble_id,
      monto,
      mes_facturado,
      estado: EstadoFactura.PAGADA,
      transaccion_id,
    });

    await this.facturaRepo.save(factura);
    this.logger.log(`Pago procesado correctamente: ${transaccion_id}`);
  }
}
