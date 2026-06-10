import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Starts File Service as an HTTP service.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Enables DTO validation.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('FILE_SERVICE_PORT', 3010);

  await app.listen(port);
}

bootstrap();
