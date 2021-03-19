import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';
import { VerificationStateChangeTransformer } from '../transformers/verification-state-change.transformer';
import { UserEnricher } from '../enrichers/user.enricher';
import { AmplitudeDestination } from '../destinations/amplitude.destination';
import { BrazeDestination } from '../destinations/braze.destination';

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
export class VerificationStateChangeHandler extends BaseHandler {
  constructor(
    private transformer: VerificationStateChangeTransformer,
    private enricher: UserEnricher,
    private ampAction: AmplitudeDestination,
    private brazeAction: BrazeDestination,
  ) {
    super();

    this.transformers = [this.transformer];
    this.enrichers = [this.enricher];
    this.actions = [this.ampAction, this.brazeAction];
  }
}
