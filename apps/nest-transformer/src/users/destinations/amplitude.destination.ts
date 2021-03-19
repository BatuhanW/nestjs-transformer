import { Injectable } from '@nestjs/common';
import { BaseDestination } from '@core';
import { TestDataResult } from '../interfaces';

@Injectable()
export class AmplitudeDestination implements BaseDestination<TestDataResult> {
  async perform(payload: TestDataResult): Promise<void> {
    console.log(`[${this.constructor.name}] perform triggered with payload`, {
      ...payload,
    });
  }
}
