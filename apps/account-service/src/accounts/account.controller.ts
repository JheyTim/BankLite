import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';

/**
 * Handles account-related HTTP requests.
 */
@Controller('accounts')
export class AccountController {
  constructor(
    /**
     * Contains account business logic.
     */
    private readonly accountService: AccountService,
  ) {}

  /**
   * Lists accounts owned by one user.
   */
  @Get('users/:userId')
  async listAccountsByUser(@Param('userId') userId: string) {
    return this.accountService.listAccountsByUser(userId);
  }

  /**
   * Reads one account by ID.
   */
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return this.accountService.getAccountById(id);
  }

  /**
   * Reads account status history.
   */
  @Get(':id/status-history')
  async getAccountStatusHistory(@Param('id') id: string) {
    return this.accountService.getAccountStatusHistory(id);
  }
}
