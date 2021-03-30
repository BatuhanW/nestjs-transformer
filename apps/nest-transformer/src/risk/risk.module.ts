import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { CommonModule } from '../common/common.module';

import { SchedulerService } from './scheduler.service';
import { VerificationRequestTransformer } from './transformers/verification-request.transformer';
import { VerificationRequestHandler } from './handlers/verification-request.handler';
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
    SchedulerService,
    SchedulerProcessor,
    VerificationRequestTransformer,
    VerificationRequestHandler,
    RiskAmplitudeTransformer,
    RiskBrazeTransformer,
  ],
})
export class RiskModule {}
