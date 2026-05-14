import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserRegisteredEvent } from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes Auth Service events to RabbitMQ.
 */
@Injectable()
export class AuthPublisher {
  constructor(
    /**
     * RabbitMQ client used for event publishing.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes user.registered after a user is successfully created.
   */
  async publishUserRegistered(event: UserRegisteredEvent): Promise<void> {
    await this.rabbitClient.emit('user.registered', event).toPromise();
  }
}
