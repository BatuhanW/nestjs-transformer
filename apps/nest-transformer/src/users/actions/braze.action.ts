import { Injectable } from '@nestjs/common';

import { BaseAction } from '@core';
import { TestDataResult } from '../interfaces';

@Injectable()
export class BrazeAction implements BaseAction<TestDataResult> {
  async perform(payload: TestDataResult): Promise<void> {
    console.log(`[${this.constructor.name}] perform triggered with payload`, {
      ...payload,
    });
  }
}
