import { BaseTransformer } from '@core/transformer/base.transformer';
import { Transformer } from '../../../../../libs/core/src/decorators/transformer.decorator';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Transformer({ handler: 'TestHandler' })
@Transformer({ handler: 'Test2Handler' })
export class TestTransformer implements BaseTransformer {
  transform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }
}
