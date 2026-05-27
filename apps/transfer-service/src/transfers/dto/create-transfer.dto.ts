import {
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

/**
 * Request body for creating a transfer.
 */
export class CreateTransferDto {
  /**
   * User initiating the transfer.
   */
  @IsUUID()
  userId!: string;

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

  /**
   * Client-generated idempotency key.
   */
  @IsString()
  @MinLength(8)
  idempotencyKey!: string;
}
