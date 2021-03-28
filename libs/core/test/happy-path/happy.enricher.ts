import { BaseEnricher, DefaultObject } from '@core';

export class HappyEnricher extends BaseEnricher {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return { enriched: payload };
  }

  async onSuccess(_payload): Promise<void> {}

  async onError(_error): Promise<void> {}
}
