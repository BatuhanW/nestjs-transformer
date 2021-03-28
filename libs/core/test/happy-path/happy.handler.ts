import { Injectable } from '@nestjs/common';
import { BaseHandler } from '../../src';
import { HappyDestination } from './happy.destination';
import { HappyEnricher } from './happy.enricher';
import { HappyTransformer } from './happy.transformer';
import { HappyPayload } from './interfaces';

@Injectable()
export class HappyHandler extends BaseHandler<HappyPayload> {
  constructor(
    private happyTransformer: HappyTransformer,
    private happyEnricher: HappyEnricher,
    private happyDestination: HappyDestination,
  ) {
    super();

    this.transformer = happyTransformer;
    this.enricher = happyEnricher;
    this.destinations = [happyDestination];
  }

  async onStart(_payload: HappyPayload): Promise<void> {}
}
