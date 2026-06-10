import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Request body for user registration.
 */
export class RegisterDto {
  /**
   * User email address.
   */
  @IsEmail()
  email!: string;

  /**
   * User full name.
   */
  @IsString()
  @MinLength(2)
  fullName!: string;

  /**
   * Plaintext password from the request.
   * This will be hashed before saving.
   */
  @IsString()
  @MinLength(8)
  password!: string;

  /**
   * Optional role for local learning.
   * In real banking systems, normal users should not assign privileged roles.
   */
  @IsOptional()
  @IsIn(['USER', 'SUPPORT', 'COMPLIANCE_OFFICER', 'ADMIN'])
  role?: 'USER' | 'SUPPORT' | 'COMPLIANCE_OFFICER' | 'ADMIN';
}
