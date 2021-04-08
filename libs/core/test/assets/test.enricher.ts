import { BaseEnricher, AnyObject } from '@core';

export class TestEnricher extends BaseEnricher {
  async perform(payload: AnyObject): Promise<AnyObject> {
    return { enriched: payload };
  }
}
