import { BaseEnricher, AnyObject } from '@core';

export class TestEnricher extends BaseEnricher {
  async perform(payload: AnyObject): Promise<AnyObject> {
    return { enriched: payload };
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: AnyObject): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-disable @typescript-eslint/no-empty-function */
}
