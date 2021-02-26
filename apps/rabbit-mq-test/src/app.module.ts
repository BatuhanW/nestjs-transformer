import { HttpModule, Module } from '@nestjs/common';
import { CoreModule } from '../../../libs/core/src';
import { RabbitMQModule } from '../../../libs/rabbit-mq/src';
import { LogAction } from '../../kafka-test/src/test/actions/log.action';
import { Log2Action } from '../../kafka-test/src/test/actions/log2.action';
import { TestEnricher } from '../../kafka-test/src/test/enrichers/test.enricher';
import { TestHandler } from '../../kafka-test/src/test/handlers/test.handler';
import { Test2Handler } from '../../kafka-test/src/test/handlers/test2.handler';
import { TestTransformer } from '../../kafka-test/src/test/transformers/test.transformer';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CoreModule.register(),
    RabbitMQModule.register({ url: 'rabbit-mq://127.0.0.1:4222', queue: 'test' }),
    HttpModule,
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
