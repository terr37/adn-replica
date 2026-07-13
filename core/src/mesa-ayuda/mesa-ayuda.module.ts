import { Module } from '@nestjs/common';
import { MesaAyudaService } from './mesa-ayuda.service';
import { MesaAyudaController } from './mesa-ayuda.controller';
import { AseoModule } from '../aseo/aseo.module';

@Module({
  imports: [AseoModule],
  controllers: [MesaAyudaController],
  providers: [MesaAyudaService],
})
export class MesaAyudaModule {}
