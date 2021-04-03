import { BaseEnricher, DefaultObject } from '@core';

export class EmptyEnricher extends BaseEnricher {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return payload;
  }
}
