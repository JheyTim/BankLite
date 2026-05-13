import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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
