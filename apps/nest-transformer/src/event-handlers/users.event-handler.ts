import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '../../../../libs/kafka/src';
import { Selector } from '../selector.decorator';

@Injectable()
export class UsersHandler {
  @SubscribeTo('users')
  @Selector({event_name: 'swag'})
  async test(payload: any) {
    console.log("Inside method")
    console.log(payload);
  }
}
