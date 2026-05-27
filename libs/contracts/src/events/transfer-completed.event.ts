/**
 * Event emitted when a transfer is completed.
 */
export interface TransferCompletedEvent {
  /**
   * Unique transfer ID.
   */
  transferId: string;

  /**
   * Ledger transaction that posted the money movement.
   */
  ledgerTransactionId: string;

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
   * Unique event ID used by consumers for idempotency checks.
   */
  eventId: string;

  /**
   * Shared workflow ID used to trace logs across services.
   */
  correlationId: string;

  /**
   * ISO timestamp when the transfer completed.
   */
  completedAt: string;
}
