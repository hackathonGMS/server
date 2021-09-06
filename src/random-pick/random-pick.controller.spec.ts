import { Test, TestingModule } from '@nestjs/testing';
import { RandomPickController } from './random-pick.controller';

describe('RandomPickController', () => {
  let controller: RandomPickController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RandomPickController],
    }).compile();

    controller = module.get<RandomPickController>(RandomPickController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
