import { Injectable } from '@nestjs/common';

import { Transformer, BaseTransformer } from '@core';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Injectable()
@Transformer({ handlers: ['TestHandler', 'Test2Handler'] })
export class TestTransformer
  implements BaseTransformer<TestDataPayload, TestDataResult> {
  perform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }
}
