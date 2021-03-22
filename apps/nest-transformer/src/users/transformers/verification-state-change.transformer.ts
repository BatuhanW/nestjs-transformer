import { Injectable } from '@nestjs/common';

import { BaseTransformer, ValidationResult } from '@core';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Injectable()
export class VerificationStateChangeTransformer extends BaseTransformer<
  TestDataPayload,
  TestDataResult
> {
  validate(_payload: TestDataPayload): ValidationResult {
    return {
      success: true,
    };
  }

  perform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }

  onSuccess(payload: TestDataPayload): void {
    console.log(`[${this.constructor.name}] transformed payload`, { ...payload }, '\n');
  }
}
