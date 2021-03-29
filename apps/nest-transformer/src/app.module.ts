import { Module } from '@nestjs/common';

import { KafkaModule } from '@adapters/kafka';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { RiskModule } from './risk/risk.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          kafkaConfig: {
            clientId: configService.get('KAFKA_CLIENT_ID'),
            brokers: configService
              .get<string>('KAFKA_BROKERS')
              .split(',')
              .map((broker) => broker.trim()),
          },
          consumerConfig: {
            groupId: configService.get('KAFKA_GROUP_ID'),
          },
        };
      },
      inject: [ConfigService],
    }),
    // KafkaModule.register({
    //   kafkaConfig: { clientId: 'test-client', brokers: ['localhost:9092'] },
    //   consumerConfig: { groupId: 'test-group' },
    // }),
    CommonModule,
    UsersModule,
    RiskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
