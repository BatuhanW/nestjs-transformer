import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Provider,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { ConsumerConfig, KafkaConfig } from 'kafkajs';

import { KafkaService } from './kafka.service';

const kafkaServiceProvider: FactoryProvider<KafkaService> = {
  provide: KafkaService,
  useFactory(
    discoveryService: DiscoveryService,
    { kafkaConfig, consumerConfig }: any,
  ) {
    return new KafkaService(kafkaConfig, consumerConfig, discoveryService);
  },
  inject: [DiscoveryService, 'KAFKA_OPTIONS'],
};

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
      imports: [DiscoveryModule],
      providers: [
        {
          provide: 'KAFKA_OPTIONS',
          useValue: { kafkaConfig, consumerConfig },
        },
        kafkaServiceProvider
      ],
      exports: [KafkaService],
    };
  }
}
