import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '../../../../libs/kafka/src';
import { KafkaSubscriber } from '../../../../libs/kafka/src/kafka-subscriber.decorator';
import { Selector } from '../selector.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'users', eventName: 'user_email_change' })
export class UsersHandler {
  async test(payload: any) {
    console.log('Inside method');
    console.log(payload);
  }
}
