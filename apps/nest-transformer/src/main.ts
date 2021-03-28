import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.on('uncaughtException', (error) => {
    console.error({ error });
    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    console.error({ error });
    process.exit(1);
  });

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 5757;

  await app.listen(port);
}
bootstrap();
