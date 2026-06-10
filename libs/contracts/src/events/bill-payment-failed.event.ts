/**
 * Event emitted when a bill payment fails.
 */
export interface BillPaymentFailedEvent {
  /**
   * Unique bill payment ID.
   */
  billPaymentId: string;

  /**
   * User who attempted the bill payment.
   */
  userId: string;

  /**
   * User account that would have been debited.
   */
  fromAccountId: string;

  /**
   * Biller that should have received payment.
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
   * Failure reason.
   */
  reason: string;

  /**
   * Unique event ID used by consumers for idempotency checks.
   */
  eventId: string;

  /**
   * Shared workflow ID used to trace logs across services.
   */
  correlationId: string;

  /**
   * ISO timestamp when payment failed.
   */
  failedAt: string;
}
