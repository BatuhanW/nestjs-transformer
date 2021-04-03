import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '@core';

import { BrazePayload, EnrichedTestData } from '../../interfaces';

@Injectable()
export class UserBrazeTransformer extends BaseTransformer {
  async perform(payload: EnrichedTestData): Promise<BrazePayload> {
    return {
      braze: payload,
    };
  }
}
