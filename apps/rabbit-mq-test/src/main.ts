import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],

        queue: 'app_module',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();

