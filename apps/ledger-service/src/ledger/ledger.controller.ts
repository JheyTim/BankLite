import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateTransferPostingDto } from './dto/create-transfer-posting.dto';

/**
 * Handles ledger-related HTTP requests.
 * Some endpoints are for local learning and testing only.
 */
@Controller('ledger')
export class LedgerController {
  constructor(
    /**
     * Contains ledger business logic.
     */
    private readonly ledgerService: LedgerService,
  ) {}

  /**
   * Reads one account balance.
   */
  @Get('balances/:accountId')
  async getBalance(@Param('accountId') accountId: string) {
    return this.ledgerService.getBalance(accountId);
  }

  /**
   * Lists ledger entries for one account.
   */
  @Get('accounts/:accountId/entries')
  async listEntriesByAccount(@Param('accountId') accountId: string) {
    return this.ledgerService.listEntriesByAccount(accountId);
  }

  /**
   * Local testing endpoint for deposits.
   * In a real bank, deposits would come from a controlled payment rail.
   */
  @Post('deposits')
  async createDeposit(@Body() dto: CreateDepositDto) {
    return this.ledgerService.createDeposit(dto);
  }

  /**
   * Local testing endpoint for direct transfer posting.
   * In the final flow, Transfer Service will publish transfer.requested.
   */
  @Post('transfer-postings')
  async createTransferPosting(@Body() dto: CreateTransferPostingDto) {
    return this.ledgerService.createTransferPosting(dto);
  }
}
