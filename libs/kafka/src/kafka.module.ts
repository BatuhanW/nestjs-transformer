import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

import { KAFKA_MODULE_OPTIONS } from './constants';
import {
  KafkaModuleAsyncOptions,
  KafkaModuleOptions,
  KafkaModuleOptionsFactory,
} from './interfaces';

import { KafkaService } from './kafka.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    DiscoveryService,
    KafkaService,
    {
      provide: KAFKA_MODULE_OPTIONS,
      useValue: {
        kafkaConfig: {
          clientId: 'transformer',
          brokers: 'localhost:9092',
        },
        consumerConfig: { groupId: 'transformer-group' },
      },
    },
  ],
})
export class KafkaModule {
  static register(kafkaModuleRegisterOptions: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_MODULE_OPTIONS,
          useValue: kafkaModuleRegisterOptions,
        },
      ],
    };
  }

  static registerAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: options.imports,
      providers: [
        {
          provide: KAFKA_MODULE_OPTIONS,
          useFactory: (options: KafkaModuleOptions) => {
            console.log(options);
            return options;
          },
          inject: [KAFKA_MODULE_OPTIONS],
        },
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(options: KafkaModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: KafkaModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: KAFKA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: KAFKA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: KafkaModuleOptionsFactory) =>
        optionsFactory.createHttpOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
