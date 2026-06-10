import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  BillPaymentCompletedEvent,
  BillPaymentFailedEvent,
  BillPaymentRequestedEvent,
} from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes bill payment lifecycle events.
 */
@Injectable()
export class BillPaymentPublisher {
  constructor(
    /**
     * RabbitMQ client used for publishing events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes bill.payment.requested so Ledger Service can debit the user account.
   */
  async publishBillPaymentRequested(
    event: BillPaymentRequestedEvent,
  ): Promise<void> {
    await this.rabbitClient.emit('bill.payment.requested', event).toPromise();
  }

  /**
   * Publishes bill.payment.completed after ledger posting succeeds.
   */
  async publishBillPaymentCompleted(
    event: BillPaymentCompletedEvent,
  ): Promise<void> {
    await this.rabbitClient.emit('bill.payment.completed', event).toPromise();
  }

  /**
   * Publishes bill.payment.failed after ledger posting fails.
   */
  async publishBillPaymentFailed(event: BillPaymentFailedEvent): Promise<void> {
    await this.rabbitClient.emit('bill.payment.failed', event).toPromise();
  }
}
