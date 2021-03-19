import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@adapters/kafka';
import { VerificationRequestHandler } from './users/handlers/verification-request.handler';
import { AmplitudeAction } from './users/actions/amplitude.action';
import { BrazeAction } from './users/actions/braze.action';
import { VerificationRequestTransformer } from './users/transformers/verification-request.transformer';
import { VerificationStateChangeTransformer } from './users/transformers/verification-state-change.transformer';
import { UserEnricher } from './users/enrichers/user.enricher';
import { VerificationStateChangeHandler } from './users/handlers/verification-state-change.handler';
import { CoreModule } from '../../../libs/core/src';

@Module({
  imports: [
    CoreModule.register(),
    KafkaModule.register({
      kafkaConfig: { clientId: 'test-client', brokers: ['localhost:9092'] },
      consumerConfig: { groupId: 'test-group' },
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    VerificationRequestHandler,
    VerificationStateChangeHandler,
    VerificationRequestTransformer,
    VerificationStateChangeTransformer,
    UserEnricher,
    AmplitudeAction,
    BrazeAction,
  ],
})
export class AppModule {}
