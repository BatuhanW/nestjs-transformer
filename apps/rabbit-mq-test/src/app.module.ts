import { HttpModule, Module } from '@nestjs/common';
import { CoreModule } from '../../../libs/core/src';
import { LogAction } from './test/actions/log.action';
import { Log2Action } from './test/actions/log2.action';
import { TestEnricher } from './test/enrichers/test.enricher';
import { TestHandler } from './test/handlers/test.handler';
import { Test2Handler } from './test/handlers/test2.handler';
import { TestTransformer } from './test/transformers/test.transformer';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CoreModule.register(),
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
