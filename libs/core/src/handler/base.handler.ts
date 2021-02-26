import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class BaseHandler implements OnModuleInit {
  constructor(private readonly discoveryService: DiscoveryService) {}

  async handle(payload: any) {
    console.log(`Handler invoked for `, this.constructor.name);
    console.log(payload);
  }

  async onModuleInit() {
    console.log('BaseHandler OMI', this.discoveryService);
  }
}
