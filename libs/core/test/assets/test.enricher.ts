import { BaseEnricher, DefaultObject } from '@core';

export class TestEnricher extends BaseEnricher {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return { enriched: payload };
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: DefaultObject): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-disable @typescript-eslint/no-empty-function */
}
