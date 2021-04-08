import { BaseTransformer, AnyObject } from '@core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestDestinationTransformer extends BaseTransformer {
  perform(payload: AnyObject): AnyObject {
    return payload;
  }
}
