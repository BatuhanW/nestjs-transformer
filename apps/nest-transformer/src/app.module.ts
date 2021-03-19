import { HttpModule, Module } from '@nestjs/common';

import { CoreModule } from '@core';
import { KafkaModule } from '@adapters/kafka';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { VerificationRequestHandler } from './users/handlers/verification-request.handler';
import { VerificationStateChangeHandler } from './users/handlers/verification-state-change.handler';

import { VerificationRequestTransformer } from './users/transformers/verification-request.transformer';
import { VerificationStateChangeTransformer } from './users/transformers/verification-state-change.transformer';

import { UserEnricher } from './users/enrichers/user.enricher';

import { AmplitudeDestination } from './users/destinations/amplitude.destination';
import { BrazeDestination } from './users/destinations/braze.destination';

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
    AmplitudeDestination,
    BrazeDestination,
  ],
})
export class AppModule {}
