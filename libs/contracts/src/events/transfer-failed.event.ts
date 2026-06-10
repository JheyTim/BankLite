/**
 * Event emitted when a transfer fails.
 */
export interface TransferFailedEvent {
  /**
   * Unique transfer ID.
   */
  transferId: string;

  /**
   * Sender account.
   */
  fromAccountId: string;

  /**
   * Receiver account.
   */
  toAccountId: string;

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
   * ISO timestamp when the transfer failed.
   */
  failedAt: string;
}
