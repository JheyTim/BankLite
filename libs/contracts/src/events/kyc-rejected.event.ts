/**
 * Event emitted when a user's KYC case is rejected.
 */
export interface KycRejectedEvent {
  /**
   * Unique KYC case ID.
   */
  kycCaseId: string;

  /**
   * User whose KYC was rejected.
   */
  userId: string;

  /**
   * Reviewer who rejected the KYC case.
   */
  reviewedByUserId: string;

  /**
   * Rejection reason.
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
   * ISO timestamp when rejection happened.
   */
  rejectedAt: string;
}
