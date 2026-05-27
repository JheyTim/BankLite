import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferService } from './transfer.service';

/**
 * Handles transfer-related HTTP requests.
 */
@Controller('transfers')
export class TransferController {
  constructor(
    /**
     * Contains transfer business logic.
     */
    private readonly transferService: TransferService,
  ) {}

  /**
   * Creates a transfer request.
   */
  @Post()
  async createTransfer(@Body() dto: CreateTransferDto) {
    return this.transferService.createTransfer(dto);
  }

  /**
   * Lists transfers for one user.
   */
  @Get('users/:userId')
  async listTransfersByUser(@Param('userId') userId: string) {
    return this.transferService.listTransfersByUser(userId);
  }

  /**
   * Reads one transfer by ID.
   */
  @Get(':id')
  async getTransferById(@Param('id') id: string) {
    return this.transferService.getTransferById(id);
  }

  /**
   * Reads transfer status history.
   */
  @Get(':id/status-history')
  async getTransferStatusHistory(@Param('id') id: string) {
    return this.transferService.getTransferStatusHistory(id);
  }
}
