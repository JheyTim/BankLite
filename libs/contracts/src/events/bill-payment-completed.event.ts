/**
 * Event emitted when a bill payment is completed.
 */
export interface BillPaymentCompletedEvent {
  /**
   * Unique bill payment ID.
   */
  billPaymentId: string;

  /**
   * Ledger transaction that posted the payment.
   */
  ledgerTransactionId: string;

  /**
   * User who paid the bill.
   */
  userId: string;

  /**
   * User account that was debited.
   */
  fromAccountId: string;

  /**
   * Biller that received payment.
   */
  billerId: string;

  /**
   * Amount in minor units.
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
   * ISO timestamp when payment completed.
   */
  completedAt: string;
}
