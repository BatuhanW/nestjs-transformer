import { VerificationStateChangeTransformer } from './transformers/verification-state-change.transformer';
import { Module } from '@nestjs/common';
import { VerificationStateChangeMuavin } from './verification-state-change.muavin';
import { CommonModule } from '../common/common.module';
import { UserBrazeTransformer } from './transformers/user-braze.transformer';
import { UserAmplitudeTransformer } from './transformers/user-amplitude.transformer';

@Module({
  imports: [CommonModule],
  providers: [
    VerificationStateChangeTransformer,
    VerificationStateChangeMuavin,
    UserBrazeTransformer,
    UserAmplitudeTransformer,
  ],
})
export class UsersModule {}
