import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';
import { PlaneamientoService } from './planeamiento.service';
import { PlaneamientoController } from './planeamiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permiso])],
  controllers: [PlaneamientoController],
  providers: [PlaneamientoService],
})
export class PlaneamientoModule {}
