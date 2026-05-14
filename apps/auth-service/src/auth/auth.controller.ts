import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Handles authentication HTTP requests.
 */
@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Contains authentication business logic.
     */
    private readonly authService: AuthService,
  ) {}

  /**
   * Registers a new user.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Logs in a user and returns a JWT access token.
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
