/**
 * Event emitted when Ledger Service successfully posts a transaction.
 */
export interface LedgerPostedEvent {
  /**
   * Unique ledger transaction ID.
   */
  ledgerTransactionId: string;

  /**
   * Business reference type that caused the ledger posting.
   */
  referenceType: 'DEPOSIT' | 'TRANSFER' | 'BILL_PAYMENT';

  /**
   * Business reference ID from the originating service.
   */
  referenceId: string;

  /**
   * Account debited by the ledger transaction.
   */
  debitAccountId: string;

  /**
   * Account credited by the ledger transaction.
   */
  creditAccountId: string;

  /**
   * Amount in minor units.
   * Example: PHP 500.00 = 50000.
   */
  amountMinor: number;

  /**
   * Currency code.
   */
  currency: 'PHP' | 'USD';

  /**
   * Unique event ID used by consumers for idempotency checks.
   */
  eventId: string;

  /**
   * Shared workflow ID used to trace logs across services.
   */
  correlationId: string;

  /**
   * ISO timestamp when posting happened.
   */
  postedAt: string;
}
