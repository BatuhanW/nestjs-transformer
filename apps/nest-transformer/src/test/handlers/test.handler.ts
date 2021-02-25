import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';
import { Handler } from '@core/decorators/handler.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'test', eventName: 'test' })
@Handler({ name: 'TestHandler' })
export class TestHandler {
  async handle(payload: any) {
    console.log('Inside method');
    console.log(payload);
  }
}
