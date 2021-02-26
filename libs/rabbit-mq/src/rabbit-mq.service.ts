import { RabbitMQModuleRegisterOptions } from './rabbit-mq.module';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

let amqp: any = {}
@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client: any;
  private readonly options: RabbitMQModuleRegisterOptions;

  constructor(
    private readonly rabbitMQOptions: RabbitMQModuleRegisterOptions,
    private readonly discoveryService: DiscoveryService,
  ) {
    this.options = rabbitMQOptions

    require('amqplib')

    amqp = require('amqp-connection-manager');
  }

  async onModuleInit() {
    this.client = amqp.connect(this.options.url)
  }
}
