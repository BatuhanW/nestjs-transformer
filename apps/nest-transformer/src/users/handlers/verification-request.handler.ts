import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { Handler, BaseHandler } from '@core';
import { VerificationRequestTransformer } from '../transformers/verification-request.transformer';
import { UserEnricher } from '../enrichers/user.enricher';
import { AmplitudeAction } from '../actions/amplitude.action';
import { BrazeAction } from '../actions/braze.action';

@Injectable()
@KafkaSubscriber({
  topicName: 'risk.users.queue',
  filter: (payload) => payload.event_name === 'id_check_request',
})
@Handler()
export class VerificationRequestHandler extends BaseHandler {
  constructor(
    private transformer: VerificationRequestTransformer,
    private enricher: UserEnricher,
    private ampAction: AmplitudeAction,
    private brazeAction: BrazeAction,
  ) {
    super();

    this.transformers = [this.transformer];
    this.enrichers = [this.enricher];
    this.actions = [this.ampAction, this.brazeAction];
  }
}
