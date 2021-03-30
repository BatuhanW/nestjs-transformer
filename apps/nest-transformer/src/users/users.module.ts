import { VerificationStateChangeTransformer } from './transformers/verification-state-change.transformer';
import { Module } from '@nestjs/common';
import { VerificationStateChangeHandler } from './handlers/verification-state-change.handler';
import { CommonModule } from '../common/common.module';
import { UserBrazeTransformer } from './transformers/user-braze.transformer';
import { UserAmplitudeTransformer } from './transformers/user-amplitude.transformer';

@Module({
  imports: [CommonModule],
  providers: [
    VerificationStateChangeTransformer,
    VerificationStateChangeHandler,
    UserBrazeTransformer,
    UserAmplitudeTransformer,
  ],
})
export class UsersModule {}
