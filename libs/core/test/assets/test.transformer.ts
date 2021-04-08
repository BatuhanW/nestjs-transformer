import { BaseTransformer, AnyObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestTransformer extends BaseTransformer {
  perform(payload: AnyObject): AnyObject {
    return payload;
  }
}
