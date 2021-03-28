import { BaseTransformer, DefaultObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HappyTransformer extends BaseTransformer {
  perform(payload: DefaultObject): DefaultObject {
    return payload;
  }

  async onSuccess(_payload: DefaultObject): Promise<void> {}

  async onError(_error): Promise<void> {}
}
