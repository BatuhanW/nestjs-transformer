import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { KafkaModule } from '@adapters/kafka';
import { AppController } from './app.controller';

import { AppService } from './app.service';

import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { RiskModule } from './risk/risk.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      },
    }),
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
            groupId: `${configService.get('KAFKA_GROUP_ID')}-${Math.random() * 100}`,
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
