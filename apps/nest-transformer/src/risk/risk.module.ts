import { VerificationRequestHandler } from './handlers/verification-request.handler';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { VerificationRequestTransformer } from './transformers/verification-request.transformer';

@Module({
  imports: [CommonModule],
  providers: [VerificationRequestTransformer, VerificationRequestHandler],
})
export class RiskModule {}
