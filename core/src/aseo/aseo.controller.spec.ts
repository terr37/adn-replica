import { Test, TestingModule } from '@nestjs/testing';
import { AseoController } from './aseo.controller';

describe('AseoController', () => {
  let controller: AseoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AseoController],
    }).compile();

    controller = module.get<AseoController>(AseoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
