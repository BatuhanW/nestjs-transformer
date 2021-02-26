import { BaseAction } from '@core/action/base.action';
import { Action } from '@core/decorators/action.decorator';
import { Injectable } from '@nestjs/common';
import { TestDataResult } from '../interfaces';

@Injectable()
@Action({ handlers: ['TestHandler', 'Test2Handler'] })
export class LogAction implements BaseAction {
  perform(payload: TestDataResult): void {
    console.log('Data received');
    console.log(payload);
  }
}
