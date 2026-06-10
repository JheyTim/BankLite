import { FraudRuleResult } from './fraud-rule-result';

/**
 * Input required to evaluate transaction fraud rules.
 */
export interface EvaluateTransactionFraudRulesInput {
  /**
   * Type of transaction being checked.
   */
  transactionType: 'TRANSFER' | 'BILL_PAYMENT';

  /**
   * Account where money comes from.
   */
  fromAccountId: string;

  /**
   * Destination account for transfers.
   */
  toAccountId?: string;

  /**
   * Amount in minor units.
   */
  amountMinor: number;

  /**
   * Currency code.
   */
  currency: 'PHP' | 'USD';
}

/**
 * Evaluates simple fraud rules before money reaches Ledger Service.
 */
export function evaluateTransactionFraudRules(
  input: EvaluateTransactionFraudRulesInput,
): FraudRuleResult {
  const triggeredRules: string[] = [];
  let riskScore = 0;

  /**
   * PHP threshold: 50,000 PHP = 5,000,000 centavos.
   */
  if (input.currency === 'PHP' && input.amountMinor > 5_000_000) {
    triggeredRules.push('PHP_HIGH_AMOUNT');
    riskScore += 80;
  }

  /**
   * USD threshold: 1,000 USD = 100,000 cents.
   */
  if (input.currency === 'USD' && input.amountMinor > 100_000) {
    triggeredRules.push('USD_HIGH_AMOUNT');
    riskScore += 80;
  }

  /**
   * Self-transfer should never be allowed.
   */
  if (
    input.transactionType === 'TRANSFER' &&
    input.toAccountId &&
    input.fromAccountId === input.toAccountId
  ) {
    triggeredRules.push('SELF_TRANSFER');
    riskScore += 100;
  }

  if (riskScore >= 80) {
    return {
      isAllowed: false,
      riskScore,
      triggeredRules,
      reason: `Blocked by fraud rules: ${triggeredRules.join(', ')}.`,
    };
  }

  return {
    isAllowed: true,
    riskScore,
    triggeredRules,
  };
}
