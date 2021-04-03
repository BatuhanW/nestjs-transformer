import { Injectable } from '@nestjs/common';
import { BaseHandler } from '@core';

import { TestDestination } from './test.destination';
import { TestEnricher } from './test.enricher';
import { TestTransformer } from './test.transformer';
import { TestPayload } from '../interfaces';

@Injectable()
export class TestHandler extends BaseHandler<TestPayload> {
  constructor(
    private testTransformer: TestTransformer,
    private testEnricher: TestEnricher,
    private testDestination: TestDestination,
  ) {
    super();

    this.transformer = testTransformer;
    this.enricher = testEnricher;
    this.destinations = [{ transformer: testTransformer, destination: testDestination }];
  }
  /* eslint-disable @typescript-eslint/no-empty-function */
  async onStart(_payload: TestPayload): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */
}
