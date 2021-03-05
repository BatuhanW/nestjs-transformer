import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';
import { Handler, BaseHandler } from '@core';

@Injectable()
@KafkaSubscriber({ topicName: 'test' })
@Handler({ name: 'TestHandler' })
export class TestHandler extends BaseHandler {}
