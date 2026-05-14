import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BANKLITE_RABBITMQ_CLIENT,
  AUTH_EVENTS_QUEUE,
} from './rabbitmq.constants';

/**
 * Shared RabbitMQ client module.
 * Services use this to publish events to RabbitMQ.
 */
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        /**
         * Token used to inject the RabbitMQ client.
         */
        name: BANKLITE_RABBITMQ_CLIENT,

        /**
         * Reads RabbitMQ configuration from environment variables.
         */
        inject: [ConfigService],

        /**
         * Creates the RabbitMQ transport configuration.
         */
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            /**
             * RabbitMQ connection URL.
             */
            urls: [configService.get<string>('RABBITMQ_URL')!],

            /**
             * Default publishing queue for auth-related events.
             */
            queue: AUTH_EVENTS_QUEUE,

            /**
             * Durable queues survive broker restarts.
             */
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqClientModule {}
