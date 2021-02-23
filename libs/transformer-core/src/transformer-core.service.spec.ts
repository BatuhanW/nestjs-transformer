import { Test, TestingModule } from '@nestjs/testing';
import { TransformerCoreService } from './transformer-core.service';

describe('TransformerCoreService', () => {
  let service: TransformerCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformerCoreService],
    }).compile();

    service = module.get<TransformerCoreService>(TransformerCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
