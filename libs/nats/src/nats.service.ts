import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class NatsService {
  constructor(
    url: string,
    queue: string,
    private readonly discoveryService: DiscoveryService,
  ) {}
}
