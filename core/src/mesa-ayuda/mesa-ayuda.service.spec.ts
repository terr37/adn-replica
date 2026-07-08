import { Test, TestingModule } from '@nestjs/testing';
import { MesaAyudaService } from './mesa-ayuda.service';

describe('MesaAyudaService', () => {
  let service: MesaAyudaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MesaAyudaService],
    }).compile();

    service = module.get<MesaAyudaService>(MesaAyudaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
