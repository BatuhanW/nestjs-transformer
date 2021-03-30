import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '@core';
import { AmplitudePayload, EnrichedTestData } from '../../interfaces';

@Injectable()
export class RiskAmplitudeTransformer extends BaseTransformer {
  perform(payload: EnrichedTestData): AmplitudePayload {
    return {
      amplitude: payload,
    };
  }
}
