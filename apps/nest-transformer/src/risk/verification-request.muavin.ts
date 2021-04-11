import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';
import { AnyObject, Muavin } from '@core';
import { VerificationRequestTransformer } from './transformers/verification-request.transformer';
import { UserEnricher } from '../common/enrichers/user.enricher';
import { AmplitudeDestination } from '../common/destinations/amplitude.destination';
import { BrazeDestination } from '../common/destinations/braze.destination';
import { TestDataPayload } from '../interfaces';
import { RiskAmplitudeTransformer } from './transformers/risk-amplitude.transformer';
import { RiskBrazeTransformer } from './transformers/risk-braze.transformer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class VerificationRequestMuavin extends Muavin {
  constructor(
    private verificationRequestTransformer: VerificationRequestTransformer,
    private userEnricher: UserEnricher,
    private riskAmpTransformer: RiskAmplitudeTransformer,
    private ampDestination: AmplitudeDestination,
    private riskBrazeTransformer: RiskBrazeTransformer,
    private brazeDestination: BrazeDestination,
    @InjectQueue('scheduler') private schedulerProcessor: Queue,
  ) {
    super();

    this.transformer = this.verificationRequestTransformer;
    this.enricher = this.userEnricher;
    this.actions = [
      { name: 'Amplitude', transformer: this.riskAmpTransformer, destination: this.ampDestination },
      { name: 'Braze', transformer: this.riskBrazeTransformer, destination: this.brazeDestination },
    ];
  }

  @KafkaSubscriber({
    topicName: 'risk.users.queue',
    filter: (payload) => payload.event_name === 'id_check_request',
  })
  async schedule(event: Record<string, any>): Promise<void> {
    console.log('Scheduling with payload');
    await this.schedulerProcessor.add('process', event.payload, {});
    console.log('Scheduled with payload');
  }

  async scheduleActions(payload: AnyObject): Promise<void> {
    for (const action of this.actions) {
      await this.schedulerProcessor.add('handleAction', { name: action.name, payload });
    }
  }

  onStart(payload: TestDataPayload): void {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
  }

  onSuccess(): void {
    console.log(`[${this.constructor.name}] Success!`, '\n');
  }
}
