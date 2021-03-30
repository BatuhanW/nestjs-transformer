import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '@core';

import { BrazePayload, EnrichedTestData } from '../../interfaces';

@Injectable()
export class UserBrazeTransformer extends BaseTransformer {
  perform(payload: EnrichedTestData): BrazePayload {
    return {
      braze: payload,
    };
  }
}
