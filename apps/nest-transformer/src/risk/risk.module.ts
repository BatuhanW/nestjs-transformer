import { VerificationRequestHandler } from './handlers/verification-request.handler';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { VerificationRequestTransformer } from './transformers/verification-request.transformer';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [CommonModule],
  providers: [SchedulerService, VerificationRequestTransformer, VerificationRequestHandler],
})
export class RiskModule {}
