import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, ACCOUNT_EVENTS_QUEUE } from '@app/messaging';
import { Account } from './entities/account.entity';
import { AccountStatusHistory } from './entities/account-status-history.entity';
import { AccountController } from './account.controller';
import { AccountConsumer } from './account.consumer';
import { AccountPublisher } from './account.publisher';
import { AccountService } from './account.service';

/**
 * Account module for bank account metadata.
 */
@Module({
  imports: [
    /**
     * Registers account repositories.
     */
    TypeOrmModule.forFeature([Account, AccountStatusHistory]),

    /**
     * Temporary publisher queue for account lifecycle events.
     * Later, we can route these events to Ledger, Notification, and Audit queues.
     */
    RabbitMqClientModule.register(ACCOUNT_EVENTS_QUEUE),
  ],
  controllers: [AccountController, AccountConsumer],
  providers: [AccountService, AccountPublisher],
})
export class AccountModule {}
