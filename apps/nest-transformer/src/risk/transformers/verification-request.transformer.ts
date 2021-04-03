import { Injectable } from '@nestjs/common';

import { BaseTransformer, ValidationResult } from '@core';
import { TestDataPayload, TestDataResult } from '../../interfaces';

@Injectable()
export class VerificationRequestTransformer extends BaseTransformer<
  TestDataPayload,
  TestDataResult
> {
  async validate(_payload: TestDataPayload): Promise<ValidationResult> {
    return {
      success: true,
    };
  }

  async perform(payload: TestDataPayload): Promise<TestDataResult> {
    return {
      data: payload,
    };
  }

  onError(error: Error) {
    console.error('onError Hook transformer', { error });
  }

  async onSuccess(payload: TestDataResult): Promise<void> {
    console.log(`[${this.constructor.name}] transformed payload`, { ...payload }, '\n');
  }
}
