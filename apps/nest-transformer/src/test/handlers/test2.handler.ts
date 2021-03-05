import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';

@Injectable()
@KafkaSubscriber({
  topicName: 'test',
  filter: (message) => message.event_name === 'test2',
})
@Handler({ name: 'Test2Handler' })
export class Test2Handler extends BaseHandler {}
