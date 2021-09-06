import { Test, TestingModule } from '@nestjs/testing';
import { RandomPickService } from './random-pick.service';

describe('RandomPickService', () => {
  let service: RandomPickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomPickService],
    }).compile();

    service = module.get<RandomPickService>(RandomPickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
