import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { BaseHandler } from '@core';
import { VerificationStateChangeTransformer } from '../transformers/verification-state-change.transformer';
import { UserEnricher } from '../../common/enrichers/user.enricher';
import { AmplitudeDestination } from '../../common/destinations/amplitude.destination';
import { BrazeDestination } from '../../common/destinations/braze.destination';
import { TestDataPayload } from '../../interfaces';

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
export class VerificationStateChangeHandler extends BaseHandler<TestDataPayload> {
  constructor(
    private verificationStateChangeTransformer: VerificationStateChangeTransformer,
    private userEnricher: UserEnricher,
    private ampDestination: AmplitudeDestination,
    private brazeDestination: BrazeDestination,
  ) {
    super();

    this.transformer = this.verificationStateChangeTransformer;
    this.enricher = this.userEnricher;
    this.destinations = [this.ampDestination, this.brazeDestination];
  }

  onStart(payload: TestDataPayload): void {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
  }

  onSuccess(): void {
    console.log(`[${this.constructor.name}] Success!`, '\n');
  }
}
