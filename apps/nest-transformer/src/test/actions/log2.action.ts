import { BaseAction } from '@core/action/base.action';
import { Action } from '@core/decorators/action.decorator';
import { Injectable } from '@nestjs/common';
import { TestDataResult } from '../interfaces';

@Injectable()
@Action({ handlers: ['TestHandler', 'Test2Handler'] })
export class Log2Action implements BaseAction {
  perform(payload: TestDataResult): void {
    console.log("Data received 2")
    console.log(payload)
  }
}
