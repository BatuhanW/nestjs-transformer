import { Injectable } from '@nestjs/common';

import { BaseTransformer } from '@core';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Injectable()
export class VerificationStateChangeTransformer
  implements BaseTransformer<TestDataPayload, TestDataResult> {
  perform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }
}
