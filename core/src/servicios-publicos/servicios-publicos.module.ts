import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fosa } from './entities/fosa.entity';
import { ServiciosPublicosService } from './servicios-publicos.service';
import { ServiciosPublicosController } from './servicios-publicos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fosa])],
  controllers: [ServiciosPublicosController],
  providers: [ServiciosPublicosService],
})
export class ServiciosPublicosModule {}
