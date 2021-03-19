import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';

const topics = [
  'verification_not_started',
  'verification_failed',
  'verification_in_progress',
  'verification_verified',
];

@Injectable()
@KafkaSubscriber({
  topicName: 'users',
  filter: (message) => topics.includes(message.event_name),
})
@Handler()
export class VerificationStateChangeHandler extends BaseHandler {}
