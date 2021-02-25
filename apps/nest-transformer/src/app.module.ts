import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@adapters/kafka';
import { TestHandler } from './test/handlers/test.handler';
import { LogAction } from './test/actions/log.action';
import { Log2Action } from './test/actions/log2.action';
import { TestTransformer } from './test/transformers/test.transformer';
import { TestEnricher } from './test/enrichers/test.enricher';
import { Test2Handler } from './test/handlers/test2.handler';

@Module({
  imports: [
    KafkaModule.register({
      kafkaConfig: { clientId: 'test', brokers: ['localhost:9092'] },
      consumerConfig: { groupId: 'test' },
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TestHandler,
    Test2Handler,
    TestTransformer,
    TestEnricher,
    LogAction,
    Log2Action,
  ],
})
export class AppModule {}
