import { Module } from '@nestjs/common';
import { PagosConsumerService } from './pagos-consumer.service';
import { AseoModule } from '../aseo/aseo.module';

@Module({
  imports: [AseoModule],
  providers: [PagosConsumerService],
})
export class PagosModule {}
