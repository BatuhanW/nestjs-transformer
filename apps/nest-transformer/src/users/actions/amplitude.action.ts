import { Injectable } from '@nestjs/common';
import { Action, BaseAction } from '@core';
import { TestDataResult } from '../interfaces';

@Injectable()
@Action({
  handlers: ['VerificationRequestHandler', 'VerificationStateChangeHandler'],
})
export class AmplitudeAction implements BaseAction<TestDataResult> {
  async perform(payload: TestDataResult): Promise<void> {
    console.log('Data received');
    console.log(payload);
  }
}
