import { Injectable } from '@nestjs/common';
import { BaseDestination } from '@core';
import { TestDataResult } from '../interfaces';

@Injectable()
export class AmplitudeDestination extends BaseDestination<TestDataResult> {
  async perform(payload: TestDataResult): Promise<void> {
    payload.data.test2.test3;

    console.log(`[${this.constructor.name}] perform triggered with payload`, {
      ...payload,
    });
  }

  onSuccess(): void {
    console.log(`[${this.constructor.name}] Success!`);
  }
}
