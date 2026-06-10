import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import {
  BANKLITE_RABBITMQ_CLIENT,
  LEDGER_TO_BILL_PAYMENT_CLIENT,
} from '@app/messaging';

/**
 * Publishes ledger result events.
 */
@Injectable()
export class LedgerPublisher {
  constructor(
    /**
     * RabbitMQ client used for transfer-related ledger result events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly transferRabbitClient: ClientProxy,

    /**
     * RabbitMQ client used for bill-payment-related ledger result events.
     */
    @Inject(LEDGER_TO_BILL_PAYMENT_CLIENT)
    private readonly billPaymentRabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes ledger.posted when a ledger transaction succeeds.
   */
  async publishLedgerPosted(event: LedgerPostedEvent): Promise<void> {
    if (event.referenceType === 'BILL_PAYMENT') {
      await this.billPaymentRabbitClient
        .emit('ledger.posted', event)
        .toPromise();
      return;
    }

    await this.transferRabbitClient.emit('ledger.posted', event).toPromise();
  }

  /**
   * Publishes ledger.failed when a ledger transaction fails.
   */
  async publishLedgerFailed(event: LedgerFailedEvent): Promise<void> {
    if (event.referenceType === 'BILL_PAYMENT') {
      await this.billPaymentRabbitClient
        .emit('ledger.failed', event)
        .toPromise();
      return;
    }

    await this.transferRabbitClient.emit('ledger.failed', event).toPromise();
  }
}
