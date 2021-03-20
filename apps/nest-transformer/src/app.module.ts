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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule.register(),
    KafkaModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        kafkaConfig: {
          clientId: configService.get('KAFKA_CLIENT_ID'),
          brokers: configService
            .get('KAFKA_BROKERS')
            .split(',')
            .map((broker) => broker.trim()),
        },
        consumerConfig: { groupId: configService.get('KAFKA_GROUP_ID') },
      }),
      inject: [ConfigService],
    }),
    // KafkaModule.register({
    //   kafkaConfig: { clientId: 'test-client', brokers: ['localhost:9092'] },
    //   consumerConfig: { groupId: 'test-group' },
    // }),
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
