import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, LEDGER_EVENTS_QUEUE } from '@app/messaging';
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
     * Temporary publisher queue.
     * Later, Transfer Service will consume ledger.posted and ledger.failed.
     */
    RabbitMqClientModule.register(LEDGER_EVENTS_QUEUE),
  ],
  controllers: [LedgerController, LedgerConsumer],
  providers: [LedgerService, LedgerPublisher],
})
export class LedgerModule {}
