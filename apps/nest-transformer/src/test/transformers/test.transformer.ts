import { BaseTransformer } from '@core/transformer/base.transformer';
import { TestDataPayload, TestDataResult } from '../interfaces';

export class TestTransformer implements BaseTransformer {
  transform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload
    }
  }
}
