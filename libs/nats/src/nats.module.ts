import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { NatsService } from './nats.service';

const NATS_MODULE_REGISTER_OPTIONS = 'NATS_MODULE_REGISTER_OPTIONS';
interface NatsModuleRegisterOptions {
  url: string;
  queue: string;
}

const natsServiceProvider: FactoryProvider<NatsService> = {
  provide: NatsService,
  useFactory(
    discoveryService: DiscoveryService,
    { url, queue }: NatsModuleRegisterOptions,
  ) {
    return new NatsService(url, queue, discoveryService);
  },
  inject: [DiscoveryService, NATS_MODULE_REGISTER_OPTIONS],
};

@Global()
@Module({})
export class NatsModule {
  static register(
    natsModuleRegisterOptions: NatsModuleRegisterOptions,
  ): DynamicModule {
    return {
      global: true,
      module: NatsModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: NATS_MODULE_REGISTER_OPTIONS,
          useValue: natsModuleRegisterOptions,
        },
        natsServiceProvider,
      ],
    };
  }
}
