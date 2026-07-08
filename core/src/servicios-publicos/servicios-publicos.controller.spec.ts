import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosPublicosController } from './servicios-publicos.controller';

describe('ServiciosPublicosController', () => {
  let controller: ServiciosPublicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosPublicosController],
    }).compile();

    controller = module.get<ServiciosPublicosController>(ServiciosPublicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
