import { BaseTransformer } from '@core/transformer/base.transformer';
import { Injectable } from '@nestjs/common';
import { Transformer } from '../../../../../libs/core/src/decorators/transformer.decorator';
import { TestDataPayload, TestDataResult } from '../interfaces';

@Injectable()
@Transformer({ handler: 'TestHandler' })
export class TestTransformer implements BaseTransformer {
  transform(payload: TestDataPayload): TestDataResult {
    return {
      data: payload,
    };
  }
}
