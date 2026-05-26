import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes ledger result events.
 */
@Injectable()
export class LedgerPublisher {
  constructor(
    /**
     * RabbitMQ client used for publishing events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes ledger.posted when a ledger transaction succeeds.
   */
  async publishLedgerPosted(event: LedgerPostedEvent): Promise<void> {
    await this.rabbitClient.emit('ledger.posted', event).toPromise();
  }

  /**
   * Publishes ledger.failed when a ledger transaction fails.
   */
  async publishLedgerFailed(event: LedgerFailedEvent): Promise<void> {
    await this.rabbitClient.emit('ledger.failed', event).toPromise();
  }
}
