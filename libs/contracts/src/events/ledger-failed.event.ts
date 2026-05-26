/**
 * Event emitted when Ledger Service fails to post a transaction.
 */
export interface LedgerFailedEvent {
  /**
   * Business reference type that caused the ledger attempt.
   */
  referenceType: 'DEPOSIT' | 'TRANSFER' | 'BILL_PAYMENT';

  /**
   * Business reference ID from the originating service.
   */
  referenceId: string;

  /**
   * Reason the ledger posting failed.
   */
  reason: string;

  /**
   * Optional debit account ID.
   */
  debitAccountId?: string;

  /**
   * Optional credit account ID.
   */
  creditAccountId?: string;

  /**
   * Amount in minor units.
   */
  amountMinor?: number;

  /**
   * Currency code.
   */
  currency?: 'PHP' | 'USD';

  /**
   * Unique event ID used by consumers for idempotency checks.
   */
  eventId: string;

  /**
   * Shared workflow ID used to trace logs across services.
   */
  correlationId: string;

  /**
   * ISO timestamp when failure happened.
   */
  failedAt: string;
}
