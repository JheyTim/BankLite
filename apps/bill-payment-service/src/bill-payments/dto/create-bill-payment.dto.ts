import {
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

/**
 * Request body for creating a bill payment.
 */
export class CreateBillPaymentDto {
  /**
   * User paying the bill.
   */
  @IsUUID()
  userId!: string;

  /**
   * Account where money will be deducted.
   */
  @IsUUID()
  fromAccountId!: string;

  /**
   * Biller receiving the payment.
   */
  @IsUUID()
  billerId!: string;

  /**
   * Customer account/reference number at the biller.
   */
  @IsString()
  @MinLength(3)
  billerReferenceNumber!: string;

  /**
   * Amount in minor units.
   */
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  /**
   * Payment currency.
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
