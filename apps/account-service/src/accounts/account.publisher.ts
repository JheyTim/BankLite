import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccountActivatedEvent, AccountCreatedEvent } from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes account lifecycle events.
 */
@Injectable()
export class AccountPublisher {
  constructor(
    /**
     * RabbitMQ client used to publish events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes account.created after an account row is created.
   */
  async publishAccountCreated(event: AccountCreatedEvent): Promise<void> {
    await this.rabbitClient.emit('account.created', event).toPromise();
  }

  /**
   * Publishes account.activated after an account becomes active.
   */
  async publishAccountActivated(event: AccountActivatedEvent): Promise<void> {
    await this.rabbitClient.emit('account.activated', event).toPromise();
  }
}
