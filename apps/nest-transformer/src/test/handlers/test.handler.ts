import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'test', eventName: 'test' })
export class TestHandler {
  async test(payload: any) {
    console.log('Inside method');
    console.log(payload);
  }
}
