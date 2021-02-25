import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'test', eventName: 'test' })
export class Test2Handler {
  async handle(payload: any) {
    console.log('Inside method 2');
    console.log(payload);
  }
}
