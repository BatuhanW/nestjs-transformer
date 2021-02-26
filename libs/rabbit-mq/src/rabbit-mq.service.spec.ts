import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbit-mq.service';

describe('RabbitMQService', () => {
  let service: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQService],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
