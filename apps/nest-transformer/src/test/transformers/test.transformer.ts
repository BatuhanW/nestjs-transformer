import { BaseTransformer } from '@core/transformer/base-transformer';
import { TestDataPayload, TestDataResult } from '../interfaces';

export class TestTransformer extends BaseTransformer {
  transform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload
    }
  }
}
