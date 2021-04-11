import { Injectable } from '@nestjs/common';
import { AnyObject, Muavin } from '@core';

import { TestDestination } from './test.destination';
import { TestEnricher } from './test.enricher';
import { TestTransformer } from './test.transformer';

import { TestPayload } from '../interfaces';

@Injectable()
export class EmptyTestMuavin extends Muavin {}

@Injectable()
export class TestMuavinWithOnStart extends Muavin {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async onStart(_payload: TestPayload): Promise<void> {}
}

@Injectable()
export class TestMuavinWithOnSuccess extends Muavin {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onSuccess(): Promise<void> {}
}

@Injectable()
export class TestMuavinWithSkipTrue extends Muavin {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async skip(_payload: AnyObject): Promise<boolean> {
    return true;
  }
}

@Injectable()
export class TestMuavinWithSkipFalse extends Muavin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async skip(_payload: AnyObject): Promise<boolean> {
    return false;
  }
}

@Injectable()
export class TestMuavinWithTransformer extends Muavin {
  constructor(private testTransformer: TestTransformer) {
    super();

    this.transformer = testTransformer;
  }
}

@Injectable()
export class TestMuavinWithEnricher extends Muavin {
  constructor(private testEnricher: TestEnricher) {
    super();

    this.enricher = testEnricher;
  }
}

@Injectable()
export class TestMuavinWithDestination extends Muavin {
  constructor(private destination: TestDestination) {
    super();

    this.actions = [{ name: 'action', destination }];
  }
}

@Injectable()
export class TestMuavinWithTransformerDestination extends Muavin {
  constructor(private testTransformer: TestTransformer, private destination: TestDestination) {
    super();

    this.actions = [{ name: 'action', transformer: testTransformer, destination }];
  }
}
