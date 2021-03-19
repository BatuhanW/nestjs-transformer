import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';

@Injectable()
@KafkaSubscriber({
  topicName: 'risk.users.queue',
  filter: (payload) => payload.event_name === 'id_check_request',
})
@Handler({ name: 'VerificationRequestHandler' })
export class VerificationRequestHandler extends BaseHandler {}
