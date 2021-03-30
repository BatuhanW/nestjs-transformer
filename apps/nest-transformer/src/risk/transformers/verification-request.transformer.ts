import { Injectable } from '@nestjs/common';

import { BaseTransformer, ValidationResult } from '@core';
import { TestDataPayload, TestDataResult } from '../../interfaces';

@Injectable()
export class VerificationRequestTransformer extends BaseTransformer<
  TestDataPayload,
  TestDataResult
> {
  validate(_payload: TestDataPayload): ValidationResult {
    return {
      success: true,
    };
  }

  perform(payload: TestDataPayload): TestDataResult {
    (payload as any).test.failow;
    return {
      data: payload,
    };
  }

  onError(error: Error) {
    console.error('onError Hook transformer', { error });
  }

  onSuccess(payload: TestDataResult): void {
    console.log(`[${this.constructor.name}] transformed payload`, { ...payload }, '\n');
  }
}
