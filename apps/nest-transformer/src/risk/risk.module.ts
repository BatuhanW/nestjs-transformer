import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { CommonModule } from '../common/common.module';

import { VerificationRequestTransformer } from './transformers/verification-request.transformer';
import { VerificationRequestMuavin } from './verification-request.muavin';
import { SchedulerProcessor } from './scheduler.processor';
import { RiskAmplitudeTransformer } from './transformers/risk-amplitude.transformer';
import { RiskBrazeTransformer } from './transformers/risk-braze.transformer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scheduler',
    }),
    CommonModule,
  ],
  providers: [
    SchedulerProcessor,
    VerificationRequestTransformer,
    VerificationRequestMuavin,
    RiskAmplitudeTransformer,
    RiskBrazeTransformer,
  ],
})
export class RiskModule {}
