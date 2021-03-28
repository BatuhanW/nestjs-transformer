import { BaseEnricher, DefaultObject } from '@core';

export class HappyEnricher extends BaseEnricher {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return payload;
  }

  onSuccess(_payload) {}

  onError(error) {
    console.log(error);
  }
}
