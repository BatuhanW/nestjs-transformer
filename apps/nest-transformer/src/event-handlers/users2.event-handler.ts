import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '../../../../libs/kafka/src';
import { KafkaSubscriber } from '../../../../libs/kafka/src/kafka-subscriber.decorator';
import { Selector } from '../selector.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'users', eventName: 'swag' })
export class Users2Handler {
  static ee = 'hey';

  async test(payload: any) {
    console.log('Inside method');
    console.log(payload);
  }
}
