import { BaseAction } from '@core/action/base.action';
import { Action } from '@core/decorators/action.decorator';
import { TestDataResult } from '../interfaces';

@Action({ handler: 'TestHandler' })
@Action({ handler: 'Test2Handler' })
export class LogAction implements BaseAction {
  perform(payload: TestDataResult): void {
    console.log('Data received');
    console.log(payload);
  }
}
