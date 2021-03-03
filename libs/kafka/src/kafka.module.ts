import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

import { KAFKA_MODULE_REGISTER_OPTIONS } from './constants';
import { KafkaModuleRegisterOptions } from './interfaces';

import { KafkaService } from './kafka.service';

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
        KafkaService,
      ],
    };
  }
}
