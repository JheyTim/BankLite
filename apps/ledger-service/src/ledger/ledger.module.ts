import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BILL_PAYMENT_EVENTS_QUEUE,
  LEDGER_TO_BILL_PAYMENT_CLIENT,
  RabbitMqClientModule,
  RabbitMqExtraClientModule,
  TRANSFER_EVENTS_QUEUE,
} from '@app/messaging';
import { AccountBalance } from './entities/account-balance.entity';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { LedgerTransaction } from './entities/ledger-transaction.entity';
import { LedgerConsumer } from './ledger.consumer';
import { LedgerController } from './ledger.controller';
import { LedgerPublisher } from './ledger.publisher';
import { LedgerService } from './ledger.service';

/**
 * Ledger module for double-entry accounting.
 */
@Module({
  imports: [
    /**
     * Registers ledger repositories.
     */
    TypeOrmModule.forFeature([AccountBalance, LedgerEntry, LedgerTransaction]),

    /**
     * Publishes transfer-related ledger results to Transfer Service queue.
     */
    RabbitMqClientModule.register(TRANSFER_EVENTS_QUEUE),

    /**
     * Publishes bill-payment-related ledger results to Bill Payment Service queue.
     */
    RabbitMqExtraClientModule.register(
      LEDGER_TO_BILL_PAYMENT_CLIENT,
      BILL_PAYMENT_EVENTS_QUEUE,
    ),
  ],
  controllers: [LedgerController, LedgerConsumer],
  providers: [LedgerService, LedgerPublisher],
})
export class LedgerModule {}
