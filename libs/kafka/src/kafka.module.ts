import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConsumerConfig, KafkaConfig } from 'kafkajs';

import { KafkaService } from './kafka.service';

@Global()
@Module({})
export class KafkaModule {
  static register(
    kafkaConfig: KafkaConfig,
    consumerConfig: ConsumerConfig,
  ): DynamicModule {
    return {
      global: true,
      module: KafkaModule,
      providers: [
        {
          provide: KafkaService,
          useValue: new KafkaService(kafkaConfig, consumerConfig),
        },
      ],
      exports: [KafkaService],
    };
  }
}
