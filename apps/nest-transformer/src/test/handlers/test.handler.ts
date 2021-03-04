import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka/kafka-subscriber.decorator';
import { Handler } from '@core/decorators/handler.decorator';
import { BaseHandler } from '@core/handler/base.handler';

@Injectable()
@KafkaSubscriber({ topicName: 'test'})
@Handler({ name: 'TestHandler' })
export class TestHandler extends BaseHandler {}
