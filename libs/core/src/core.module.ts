import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { CoreService } from './core.service';
import { BaseHandler } from './handler/base.handler';

@Global()
@Module({})
export class CoreModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: CoreModule,
      imports: [DiscoveryModule],
      providers: [CoreService, DiscoveryService, BaseHandler],
      exports: [DiscoveryService, BaseHandler],
    };
  }
}
