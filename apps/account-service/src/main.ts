import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ACCOUNT_EVENTS_QUEUE } from '@app/messaging';
import { AppModule } from './app.module';

/**
 * Starts Account Service as both HTTP server and RabbitMQ consumer.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Enables DTO validation for HTTP endpoints.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  /**
   * Connect RabbitMQ consumer for kyc.verified events.
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')!],
      queue: ACCOUNT_EVENTS_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  /**
   * Start RabbitMQ consumer.
   */
  await app.startAllMicroservices();

  /**
   * Start HTTP server.
   */
  const port = configService.get<number>('ACCOUNT_SERVICE_PORT', 3004);
  await app.listen(port);
}

bootstrap();
