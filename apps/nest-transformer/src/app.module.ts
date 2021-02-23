import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@adapters/kafka';

@Module({
  imports: [
    KafkaModule.register(
      { clientId: 'test', brokers: ['localhost:9092'] },
      { groupId: 'test' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
