import { IsIn, IsInt, IsPositive, IsUUID } from 'class-validator';

/**
 * Request body for local testing deposits.
 * This simulates adding money into a BankLite account.
 */
export class CreateDepositDto {
  /**
   * Account receiving the deposit.
   */
  @IsUUID()
  accountId!: string;

  /**
   * Amount in minor units.
   * Example: PHP 500.00 = 50000.
   */
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  /**
   * Deposit currency.
   */
  @IsIn(['PHP', 'USD'])
  currency!: 'PHP' | 'USD';
}
