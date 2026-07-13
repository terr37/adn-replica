import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inmueble } from './entities/inmueble.entity';
import { Factura } from './entities/factura.entity';
import { Incidencia } from './entities/incidencia.entity';
import { AseoService } from './aseo.service';
import { AseoController } from './aseo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inmueble, Factura, Incidencia])],
  controllers: [AseoController],
  providers: [AseoService],
  exports: [TypeOrmModule, AseoService],
})
export class AseoModule {}
