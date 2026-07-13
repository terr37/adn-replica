import { Test, TestingModule } from '@nestjs/testing';
import { MesaAyudaController } from './mesa-ayuda.controller';

describe('MesaAyudaController', () => {
  let controller: MesaAyudaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaAyudaController],
    }).compile();

    controller = module.get<MesaAyudaController>(MesaAyudaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
