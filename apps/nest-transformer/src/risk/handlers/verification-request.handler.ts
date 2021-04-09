import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { BaseHandler } from '@core';
import { VerificationRequestTransformer } from '../transformers/verification-request.transformer';
import { UserEnricher } from '../../common/enrichers/user.enricher';
import { AmplitudeDestination } from '../../common/destinations/amplitude.destination';
import { BrazeDestination } from '../../common/destinations/braze.destination';
import { TestDataPayload } from '../../interfaces';
import { RiskAmplitudeTransformer } from '../transformers/risk-amplitude.transformer';
import { RiskBrazeTransformer } from '../transformers/risk-braze.transformer';

@Injectable()
@KafkaSubscriber({
  topicName: 'risk.users.queue',
  filter: (payload) => payload.event_name === 'id_check_request',
})
export class VerificationRequestHandler extends BaseHandler {
  constructor(
    private verificationRequestTransformer: VerificationRequestTransformer,
    private userEnricher: UserEnricher,
    private riskAmpTransformer: RiskAmplitudeTransformer,
    private ampDestination: AmplitudeDestination,
    private riskBrazeTransformer: RiskBrazeTransformer,
    private brazeDestination: BrazeDestination,
  ) {
    super();

    this.transformer = this.verificationRequestTransformer;
    this.enricher = this.userEnricher;
    this.actions = [
      { transformer: this.riskAmpTransformer, destination: this.ampDestination },
      { transformer: this.riskAmpTransformer, destination: this.brazeDestination },
    ];
  }

  onStart(payload: TestDataPayload): void {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
  }

  onSuccess(): void {
    console.log(`[${this.constructor.name}] Success!`, '\n');
  }
}
