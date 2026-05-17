import { Controller, Get } from '@nestjs/common';
import { BillPaymentServiceService } from './bill-payment-service.service';

@Controller()
export class BillPaymentServiceController {
  constructor(private readonly billPaymentServiceService: BillPaymentServiceService) {}

  @Get()
  getHello(): string {
    return this.billPaymentServiceService.getHello();
  }
}
