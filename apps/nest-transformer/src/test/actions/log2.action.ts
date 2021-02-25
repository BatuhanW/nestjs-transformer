import { BaseAction } from '@core/action/base.action';
import { TestDataResult } from '../interfaces';

export class Log2Action implements BaseAction {
  perform(payload: TestDataResult): void {
    console.log("Data received 2")
    console.log(payload)
  }
}
