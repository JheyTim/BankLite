import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  TransferCompletedEvent,
  TransferFailedEvent,
  TransferRequestedEvent,
} from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes transfer lifecycle events.
 */
@Injectable()
export class TransferPublisher {
  constructor(
    /**
     * RabbitMQ client used to publish events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes transfer.requested so Ledger Service can post the transaction.
   */
  async publishTransferRequested(event: TransferRequestedEvent): Promise<void> {
    await this.rabbitClient.emit('transfer.requested', event).toPromise();
  }

  /**
   * Publishes transfer.completed after Ledger Service confirms posting.
   */
  async publishTransferCompleted(event: TransferCompletedEvent): Promise<void> {
    await this.rabbitClient.emit('transfer.completed', event).toPromise();
  }

  /**
   * Publishes transfer.failed after Ledger Service rejects posting.
   */
  async publishTransferFailed(event: TransferFailedEvent): Promise<void> {
    await this.rabbitClient.emit('transfer.failed', event).toPromise();
  }
}
