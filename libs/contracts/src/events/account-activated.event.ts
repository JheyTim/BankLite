/**
 * Event emitted when an account becomes active.
 */
export interface AccountActivatedEvent {
  /**
   * Unique account ID.
   */
  accountId: string;

  /**
   * User who owns the account.
   */
  userId: string;

  /**
   * Type of account activated.
   */
  accountType: 'SAVINGS' | 'CHECKING' | 'WALLET';

  /**
   * Account currency.
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
   * ISO timestamp when activation happened.
   */
  activatedAt: string;
}
