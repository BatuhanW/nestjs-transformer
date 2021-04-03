import { BaseTransformer, DefaultObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestTransformer<Payload = DefaultObject> extends BaseTransformer {
  async perform(payload: Payload): Promise<DefaultObject> {
    return payload;
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: Payload): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */
}
