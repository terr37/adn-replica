import { Test, TestingModule } from '@nestjs/testing';
import { PlaneamientoController } from './planeamiento.controller';

describe('PlaneamientoController', () => {
  let controller: PlaneamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaneamientoController],
    }).compile();

    controller = module.get<PlaneamientoController>(PlaneamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
