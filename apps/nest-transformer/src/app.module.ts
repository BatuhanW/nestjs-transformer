import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@adapters/kafka';
import { UsersHandler } from './event-handlers/users.event-handler';

@Module({
  imports: [
    KafkaModule.register(
      { clientId: 'test', brokers: ['localhost:9092'] },
      { groupId: 'test' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService, UsersHandler],
})
export class AppModule {}
