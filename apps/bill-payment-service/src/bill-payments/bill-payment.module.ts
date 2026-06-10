import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LEDGER_EVENTS_QUEUE, RabbitMqClientModule } from '@app/messaging';
import { Biller } from './entities/biller.entity';
import { BillPayment } from './entities/bill-payment.entity';
import { BillPaymentStatusHistory } from './entities/bill-payment-status-history.entity';
import { BillPaymentConsumer } from './bill-payment.consumer';
import { BillPaymentController } from './bill-payment.controller';
import { BillPaymentPublisher } from './bill-payment.publisher';
import { BillPaymentService } from './bill-payment.service';

/**
 * Bill Payment module for billers and bill payment requests.
 */
@Module({
  imports: [
    /**
     * Registers bill payment repositories.
     */
    TypeOrmModule.forFeature([Biller, BillPayment, BillPaymentStatusHistory]),

    /**
     * Publishes bill.payment.requested to Ledger Service queue.
     */
    RabbitMqClientModule.register(LEDGER_EVENTS_QUEUE),
  ],
  controllers: [BillPaymentController, BillPaymentConsumer],
  providers: [BillPaymentService, BillPaymentPublisher],
})
export class BillPaymentModule {}
