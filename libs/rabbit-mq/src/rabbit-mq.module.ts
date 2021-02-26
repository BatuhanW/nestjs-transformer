import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { RabbitMQService } from './rabbit-mq.service';

export const RABBIT_MQ_MODULE_REGISTER_OPTIONS = 'RABBIT_MQ_MODULE_REGISTER_OPTIONS';
export interface RabbitMQModuleRegisterOptions {
  url: string;
  queue: string;
}

const rabbitMQServiceProvider: FactoryProvider<RabbitMQService> = {
  provide: RabbitMQService,
  useFactory(
    discoveryService: DiscoveryService,
    rabbitMQOptions: RabbitMQModuleRegisterOptions,
  ) {
    return new RabbitMQService(rabbitMQOptions, discoveryService);
  },
  inject: [DiscoveryService, RABBIT_MQ_MODULE_REGISTER_OPTIONS],
};

@Global()
@Module({})
export class RabbitMQModule {
  static register(
    rabbitMQModuleRegisterOptions: RabbitMQModuleRegisterOptions,
  ): DynamicModule {
    return {
      global: true,
      module: RabbitMQModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: RABBIT_MQ_MODULE_REGISTER_OPTIONS,
          useValue: rabbitMQModuleRegisterOptions,
        },
        rabbitMQServiceProvider,
      ],
    };
  }
}
