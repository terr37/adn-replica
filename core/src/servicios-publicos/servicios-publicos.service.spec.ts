import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosPublicosService } from './servicios-publicos.service';

describe('ServiciosPublicosService', () => {
  let service: ServiciosPublicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiciosPublicosService],
    }).compile();

    service = module.get<ServiciosPublicosService>(ServiciosPublicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
