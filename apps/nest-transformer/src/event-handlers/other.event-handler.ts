import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '../../../../libs/kafka/src';
import { KafkaSubscriber } from '../../../../libs/kafka/src/kafka-subscriber.decorator';
import { Selector } from '../selector.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'other', eventName: 'other' })
export class OtherHandler {
  async test(payload: any) {
    console.log('Inside method');
    console.log(payload);
  }
}
