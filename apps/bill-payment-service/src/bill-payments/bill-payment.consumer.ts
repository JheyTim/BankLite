import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import { BillPaymentService } from './bill-payment.service';

/**
 * Consumes ledger result events for bill payments.
 */
@Controller()
export class BillPaymentConsumer {
  constructor(
    /**
     * Contains bill payment business logic.
     */
    private readonly billPaymentService: BillPaymentService,
  ) {}

  /**
   * Runs whenever Ledger Service publishes ledger.posted.
   */
  @EventPattern('ledger.posted')
  async handleLedgerPosted(@Payload() event: LedgerPostedEvent) {
    await this.billPaymentService.handleLedgerPosted(event);
  }

  /**
   * Runs whenever Ledger Service publishes ledger.failed.
   */
  @EventPattern('ledger.failed')
  async handleLedgerFailed(@Payload() event: LedgerFailedEvent) {
    await this.billPaymentService.handleLedgerFailed(event);
  }
}
