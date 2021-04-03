import { BaseTransformer, DefaultObject } from '@core';

export class EmptyTransformer extends BaseTransformer {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return payload;
  }
}
