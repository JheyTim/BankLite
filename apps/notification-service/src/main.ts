import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureHttpApp } from '@app/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  configureHttpApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('NOTIFICATION_SERVICE_PORT') ?? 3007;

  await app.listen(port);
}

void bootstrap();
