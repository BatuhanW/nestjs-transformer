import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';
import { Handler } from '../../../../../libs/core/src/decorators/handler.decorator';

@Injectable()
@KafkaSubscriber({ topicName: 'test', eventName: 'test' })
@Handler({ name: 'Test2Handler' })
export class Test2Handler {
  async handle(payload: any) {
    console.log('Inside method 2');
    console.log(payload);
  }
}
