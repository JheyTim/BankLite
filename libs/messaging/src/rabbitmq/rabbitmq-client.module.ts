import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BANKLITE_RABBITMQ_CLIENT } from './rabbitmq.constants';

/**
 * Shared RabbitMQ client module.
 * Services call register(queueName) so each publisher can target the queue
 * that belongs to the service consuming the event.
 */
@Module({})
export class RabbitMqClientModule {
  static register(queueName: string): DynamicModule {
    return {
      module: RabbitMqClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            /**
             * Token used to inject the RabbitMQ client.
             */
            name: BANKLITE_RABBITMQ_CLIENT,

            /**
             * Reads RabbitMQ configuration from ConfigService.
             */
            inject: [ConfigService],

            /**
             * Creates RabbitMQ transport options.
             */
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                /**
                 * RabbitMQ connection URL.
                 */
                urls: [configService.get<string>('RABBITMQ_URL')!],

                /**
                 * Queue that this publisher sends messages to.
                 */
                queue: queueName,

                /**
                 * Durable queues survive RabbitMQ restarts.
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
    };
  }
}
