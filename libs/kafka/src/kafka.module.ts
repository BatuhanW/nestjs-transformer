import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { ConsumerConfig, KafkaConfig } from 'kafkajs';

import { KafkaService } from './kafka.service';

const KAFKA_MODULE_REGISTER_OPTIONS = 'KAFKA_MODULE_REGISTER_OPTIONS';

interface KafkaModuleRegisterOptions {
  kafkaConfig: KafkaConfig;
  consumerConfig: ConsumerConfig;
}

const kafkaServiceProvider: FactoryProvider<KafkaService> = {
  provide: KafkaService,
  useFactory(
    discoveryService: DiscoveryService,
    { kafkaConfig, consumerConfig }: KafkaModuleRegisterOptions,
  ) {
    return new KafkaService(kafkaConfig, consumerConfig, discoveryService);
  },
  inject: [DiscoveryService, KAFKA_MODULE_REGISTER_OPTIONS],
};

@Global()
@Module({})
export class KafkaModule {
  static register(
    kafkaModuleRegisterOptions: KafkaModuleRegisterOptions,
  ): DynamicModule {
    return {
      global: true,
      module: KafkaModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: KAFKA_MODULE_REGISTER_OPTIONS,
          useValue: kafkaModuleRegisterOptions,
        },
        kafkaServiceProvider,
      ],
    };
  }
}
