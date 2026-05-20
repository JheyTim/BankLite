import { IsIn, IsInt, IsPositive, IsUUID } from 'class-validator';

/**
 * Request body for local transfer posting test.
 * In the real flow, Transfer Service will publish transfer.requested.
 */
export class CreateTransferPostingDto {
  /**
   * Account where money will be deducted.
   */
  @IsUUID()
  fromAccountId!: string;

  /**
   * Account where money will be credited.
   */
  @IsUUID()
  toAccountId!: string;

  /**
   * Amount in minor units.
   */
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  /**
   * Transfer currency.
   */
  @IsIn(['PHP', 'USD'])
  currency!: 'PHP' | 'USD';
}
