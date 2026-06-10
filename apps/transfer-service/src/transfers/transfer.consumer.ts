import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import { TransferService } from './transfer.service';

/**
 * Consumes ledger result events.
 */
@Controller()
export class TransferConsumer {
  constructor(
    /**
     * Contains transfer business logic.
     */
    private readonly transferService: TransferService,
  ) {}

  /**
   * Runs whenever Ledger Service publishes ledger.posted.
   */
  @EventPattern('ledger.posted')
  async handleLedgerPosted(@Payload() event: LedgerPostedEvent) {
    await this.transferService.handleLedgerPosted(event);
  }

  /**
   * Runs whenever Ledger Service publishes ledger.failed.
   */
  @EventPattern('ledger.failed')
  async handleLedgerFailed(@Payload() event: LedgerFailedEvent) {
    await this.transferService.handleLedgerFailed(event);
  }
}
