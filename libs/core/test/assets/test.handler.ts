import { Injectable } from '@nestjs/common';
import { AnyObject, BaseHandler } from '@core';

import { TestDestination } from './test.destination';
import { TestEnricher } from './test.enricher';
import { TestTransformer } from './test.transformer';

import { TestPayload } from '../interfaces';

@Injectable()
export class EmptyTestHandler extends BaseHandler {}

@Injectable()
export class TestHandlerWithOnStart extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async onStart(_payload: TestPayload): Promise<void> {}
}

@Injectable()
export class TestHandlerWithOnSuccess extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onSuccess(): Promise<void> {}
}

@Injectable()
export class TestHandlerWithSkipTrue extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async skip(_payload: AnyObject): Promise<boolean> {
    return true;
  }
}

@Injectable()
export class TestHandlerWithSkipFalse extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async skip(_payload: AnyObject): Promise<boolean> {
    return false;
  }
}

@Injectable()
export class TestHandlerWithTransformer extends BaseHandler {
  constructor(private testTransformer: TestTransformer) {
    super();

    this.transformer = testTransformer;
  }
}

@Injectable()
export class TestHandlerWithEnricher extends BaseHandler {
  constructor(private testEnricher: TestEnricher) {
    super();

    this.enricher = testEnricher;
  }
}

@Injectable()
export class TestHandlerWithDestination extends BaseHandler {
  constructor(private destination: TestDestination) {
    super();

    this.actions = [{ name: 'action', destination }];
  }
}

@Injectable()
export class TestHandlerWithTransformerDestination extends BaseHandler {
  constructor(private testTransformer: TestTransformer, private destination: TestDestination) {
    super();

    this.actions = [{ name: 'action', transformer: testTransformer, destination }];
  }
}
