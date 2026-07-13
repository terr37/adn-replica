import { Test, TestingModule } from '@nestjs/testing';
import { PlaneamientoService } from './planeamiento.service';

describe('PlaneamientoService', () => {
  let service: PlaneamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaneamientoService],
    }).compile();

    service = module.get<PlaneamientoService>(PlaneamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
