import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { Biller } from './bill-payments/entities/biller.entity';
import { BillPayment } from './bill-payments/entities/bill-payment.entity';
import { BillPaymentStatusHistory } from './bill-payments/entities/bill-payment-status-history.entity';
import { BillPaymentModule } from './bill-payments/bill-payment.module';

/**
 * Root module for Bill Payment Service.
 */
@Module({
  imports: [
    /**
     * Loads and validates environment variables.
     */
    AppConfigModule,

    /**
     * Exposes /health/live and /health/ready.
     */
    AppHealthModule,

    /**
     * Connects Bill Payment Service to PostgreSQL using bill_payment_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(
          configService,
          [Biller, BillPayment, BillPaymentStatusHistory],
          'bill_payment_schema',
        ),
    }),

    /**
     * Bill Payment feature module.
     */
    BillPaymentModule,
  ],
})
export class AppModule {}
