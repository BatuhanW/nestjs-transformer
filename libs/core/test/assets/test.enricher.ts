import { BaseEnricher, DefaultObject } from '@core';

export class TestEnricher<Payload = DefaultObject> extends BaseEnricher<Payload> {
  async perform(payload: Payload): Promise<DefaultObject> {
    return { enriched: payload };
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  async onSuccess(_payload: Payload): Promise<void> {}
  async onError(_error: Error): Promise<void> {}
  /* eslint-disable @typescript-eslint/no-empty-function */
}
