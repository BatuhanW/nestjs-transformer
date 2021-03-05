import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { KAFKA_MODULE_REGISTER_OPTIONS } from './constants';
import { KafkaModuleRegisterOptions } from './interfaces';

import { KafkaService } from './kafka.service';

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
      exports: [DiscoveryModule]
    };
  }
}
