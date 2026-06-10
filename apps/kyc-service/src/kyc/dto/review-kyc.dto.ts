import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

/**
 * Request body for approving or rejecting KYC.
 */
export class ReviewKycDto {
  /**
   * Compliance officer or admin reviewing the case.
   */
  @IsUUID()
  reviewedByUserId!: string;

  /**
   * Required when rejecting a KYC case.
   */
  @IsOptional()
  @IsString()
  @MinLength(3)
  reason?: string;
}
