import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { PROFILE_EVENTS_QUEUE } from '@app/messaging';

/**
 * Starts User Profile Service as a RabbitMQ microservice.
 */
async function bootstrap() {
  /**
   * Create a lightweight app context first so we can read ConfigService.
   */
  const appContext = await NestFactory.createApplicationContext(AppModule);

  /**
   * Reads configuration from environment variables.
   */
  const configService = appContext.get(ConfigService);

  /**
   * Creates the RabbitMQ microservice.
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        /**
         * RabbitMQ connection URL.
         */
        urls: [configService.get<string>('RABBITMQ_URL')!],

        /**
         * Queue where this service receives profile-related events.
         */
        queue: PROFILE_EVENTS_QUEUE,

        /**
         * Durable queue survives broker restarts.
         */
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  /**
   * Starts consuming RabbitMQ messages.
   */
  await app.listen();

  /**
   * Close the temporary app context.
   */
  await appContext.close();
}

bootstrap();
