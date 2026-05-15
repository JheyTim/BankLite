/**
 * Event emitted when a user's KYC case is approved.
 * Account Service will consume this in the next milestone.
 */
export interface KycVerifiedEvent {
  /**
   * Unique KYC case ID.
   */
  kycCaseId: string;

  /**
   * User whose identity was verified.
   */
  userId: string;

  /**
   * Reviewer who approved the KYC case.
   */
  reviewedByUserId: string;

  /**
   * Unique event ID used by consumers for idempotency checks.
   */
  eventId: string;

  /**
   * Shared workflow ID used to trace logs across services.
   */
  correlationId: string;

  /**
   * ISO timestamp when approval happened.
   */
  verifiedAt: string;
}
