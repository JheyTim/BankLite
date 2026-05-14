import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Starts the BankLite API Gateway.
 */
async function bootstrap() {
  /**
   * Creates the NestJS application instance.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Enables DTO validation globally.
   * This helps reject invalid request bodies before they reach business logic.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Reads the API Gateway port from environment variables.
   */
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT', 3000);

  /**
   * Starts listening for HTTP requests.
   */
  await app.listen(port);
}

bootstrap();
