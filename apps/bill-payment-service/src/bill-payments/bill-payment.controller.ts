import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBillerDto } from './dto/create-biller.dto';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { BillPaymentService } from './bill-payment.service';

/**
 * Handles biller and bill payment HTTP requests.
 */
@Controller()
export class BillPaymentController {
  constructor(
    /**
     * Contains bill payment business logic.
     */
    private readonly billPaymentService: BillPaymentService,
  ) {}

  /**
   * Creates a biller.
   */
  @Post('billers')
  async createBiller(@Body() dto: CreateBillerDto) {
    return this.billPaymentService.createBiller(dto);
  }

  /**
   * Lists active billers.
   */
  @Get('billers')
  async listBillers() {
    return this.billPaymentService.listBillers();
  }

  /**
   * Creates a bill payment.
   */
  @Post('bill-payments')
  async createBillPayment(@Body() dto: CreateBillPaymentDto) {
    return this.billPaymentService.createBillPayment(dto);
  }

  /**
   * Lists bill payments for one user.
   */
  @Get('bill-payments/users/:userId')
  async listBillPaymentsByUser(@Param('userId') userId: string) {
    return this.billPaymentService.listBillPaymentsByUser(userId);
  }

  /**
   * Reads one bill payment by ID.
   */
  @Get('bill-payments/:id')
  async getBillPaymentById(@Param('id') id: string) {
    return this.billPaymentService.getBillPaymentById(id);
  }

  /**
   * Reads bill payment status history.
   */
  @Get('bill-payments/:id/status-history')
  async getBillPaymentStatusHistory(@Param('id') id: string) {
    return this.billPaymentService.getBillPaymentStatusHistory(id);
  }
}
