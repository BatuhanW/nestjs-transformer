import { VerificationStateChangeTransformer } from './transformers/verification-state-change.transformer';
import { Module } from '@nestjs/common';
import { VerificationStateChangeHandler } from './handlers/verification-state-change.handler';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [VerificationStateChangeTransformer, VerificationStateChangeHandler],
})
export class UsersModule {}
