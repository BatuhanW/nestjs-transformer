import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '../../../../libs/kafka/src';
import { Selector } from '../selector.decorator';

@Injectable()
export class TestHandler {
  @Selector({event_name: 'swag'})
  @SubscribeTo('users')
  async test(payload: any) {
    console.log("Inside method")
    console.log(payload);
  }
}
