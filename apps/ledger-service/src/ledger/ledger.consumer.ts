import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type {
  AccountActivatedEvent,
  BillPaymentRequestedEvent,
  TransferRequestedEvent,
} from '@app/contracts';
import { LedgerService } from './ledger.service';

/**
 * Consumes events that require ledger actions.
 */
@Controller()
export class LedgerConsumer {
  constructor(
    /**
     * Contains ledger business logic.
     */
    private readonly ledgerService: LedgerService,
  ) {}

  /**
   * Runs whenever Account Service publishes account.activated.
   */
  @EventPattern('account.activated')
  async handleAccountActivated(@Payload() event: AccountActivatedEvent) {
    await this.ledgerService.initializeBalanceFromAccountActivated(event);
  }

  /**
   * Runs whenever Transfer Service publishes transfer.requested.
   */
  @EventPattern('transfer.requested')
  async handleTransferRequested(@Payload() event: TransferRequestedEvent) {
    await this.ledgerService.postTransferFromEvent(event);
  }

  /**
   * Runs whenever Bill Payment Service publishes bill.payment.requested.
   */
  @EventPattern('bill.payment.requested')
  async handleBillPaymentRequested(
    @Payload() event: BillPaymentRequestedEvent,
  ) {
    await this.ledgerService.postBillPaymentFromEvent(event);
  }
}
