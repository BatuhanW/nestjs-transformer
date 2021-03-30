import { BaseTransformer, DefaultObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestDestinationTransformer extends BaseTransformer {
  perform(payload: DefaultObject): DefaultObject {
    return payload;
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: DefaultObject): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */
}
