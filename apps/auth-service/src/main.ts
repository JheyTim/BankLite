import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Starts the Auth Service as an HTTP service for local development.
 * Later, the API Gateway can call this service internally.
 */
async function bootstrap() {
  /**
   * Creates the NestJS application instance.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Enables automatic DTO validation.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Reads the Auth Service port from environment variables.
   */
  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_SERVICE_PORT', 3001);

  /**
   * Starts the Auth Service HTTP server.
   */
  await app.listen(port);
}

bootstrap();
