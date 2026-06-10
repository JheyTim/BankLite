import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

/**
 * Extra RabbitMQ client module.
 * Use this when one service must publish to more than one target queue.
 */
@Module({})
export class RabbitMqExtraClientModule {
  static register(clientToken: string, queueName: string): DynamicModule {
    return {
      module: RabbitMqExtraClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            /**
             * Custom injection token.
             */
            name: clientToken,

            /**
             * Reads RabbitMQ configuration.
             */
            inject: [ConfigService],

            /**
             * Creates a RabbitMQ client for a specific target queue.
             */
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URL')!],
                queue: queueName,
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
