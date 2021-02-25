import { BaseAction } from '@core/action/base-action';
import { TestDataResult } from '../interfaces';

export class LogAction extends BaseAction {
  perform(payload: TestDataResult): void {
    console.log("Data received")
    console.log(payload)
  }
}
