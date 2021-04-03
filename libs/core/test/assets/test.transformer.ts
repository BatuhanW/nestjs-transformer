import { BaseTransformer, AnyObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestTransformer extends BaseTransformer {
  perform(payload: AnyObject): AnyObject {
    return payload;
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: AnyObject): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */
}
