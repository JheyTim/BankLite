import { Module } from '@nestjs/common';
import { BillPaymentServiceController } from './bill-payment-service.controller';
import { BillPaymentServiceService } from './bill-payment-service.service';

@Module({
  imports: [],
  controllers: [BillPaymentServiceController],
  providers: [BillPaymentServiceService],
})
export class BillPaymentServiceModule {}
