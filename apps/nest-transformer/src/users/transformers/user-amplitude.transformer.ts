import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '@core';
import { AmplitudePayload, EnrichedTestData } from '../../interfaces';

@Injectable()
export class UserAmplitudeTransformer extends BaseTransformer {
  async perform(payload: EnrichedTestData): Promise<AmplitudePayload> {
    return {
      amplitude: payload,
    };
  }
}
