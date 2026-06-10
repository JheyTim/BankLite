/**
 * Result returned after checking fraud rules.
 */
export interface FraudRuleResult {
  /**
   * Whether the transaction can continue to Ledger Service.
   */
  isAllowed: boolean;

  /**
   * Numeric risk score for learning/demo purposes.
   */
  riskScore: number;

  /**
   * Rules that matched this transaction.
   */
  triggeredRules: string[];

  /**
   * Human-readable reason when blocked.
   */
  reason?: string;
}
