import { NatsModuleRegisterOptions } from './nats.module';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class NatsService implements OnModuleInit {
  private client: any;
  private readonly options: NatsModuleRegisterOptions;

  constructor(
    private readonly natsOptions: NatsModuleRegisterOptions,
    private readonly discoveryService: DiscoveryService,
  ) {
  }

  async onModuleInit() {
  }
}
