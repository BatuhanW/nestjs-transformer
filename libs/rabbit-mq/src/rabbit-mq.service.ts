import { RabbitMQModuleRegisterOptions } from './rabbit-mq.module';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client: any;
  private readonly options: RabbitMQModuleRegisterOptions;

  constructor(
    private readonly natsOptions: RabbitMQModuleRegisterOptions,
    private readonly discoveryService: DiscoveryService,
  ) {
  }

  async onModuleInit() {
  }
}
