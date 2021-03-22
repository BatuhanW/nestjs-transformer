import { Injectable } from '@nestjs/common';

import { BaseTransformer, ValidationResult } from '@core';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Injectable()
export class VerificationRequestTransformer extends BaseTransformer<
  TestDataPayload,
  TestDataResult
> {
  validate(_payload: TestDataPayload): ValidationResult {
    return {
      success: false,
      message: 'Transformer failed',
    };
  }

  perform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }

  onSuccess(payload: TestDataResult): void {
    console.log(`[${this.constructor.name}] transformed payload`, { ...payload }, '\n');
  }
}
