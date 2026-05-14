import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Request body for user login.
 */
export class LoginDto {
  /**
   * User email address.
   */
  @IsEmail()
  email!: string;

  /**
   * Plaintext password used for login verification.
   */
  @IsString()
  @MinLength(8)
  password!: string;
}
