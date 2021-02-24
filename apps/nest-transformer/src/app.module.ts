import { Users2Handler } from './event-handlers/users2.event-handler';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@adapters/kafka';
import { UsersHandler } from './event-handlers/users.event-handler';
import { OtherHandler } from './event-handlers/other.event-handler';

@Module({
  imports: [
    KafkaModule.register(
      { clientId: 'test', brokers: ['localhost:9092'] },
      { groupId: 'test' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService, UsersHandler, Users2Handler, OtherHandler],
})
export class AppModule {}
