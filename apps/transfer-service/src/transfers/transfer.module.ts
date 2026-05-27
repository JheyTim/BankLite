import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, LEDGER_EVENTS_QUEUE } from '@app/messaging';
import { Transfer } from './entities/transfer.entity';
import { TransferStatusHistory } from './entities/transfer-status-history.entity';
import { TransferConsumer } from './transfer.consumer';
import { TransferController } from './transfer.controller';
import { TransferPublisher } from './transfer.publisher';
import { TransferService } from './transfer.service';

/**
 * Transfer module for money transfer requests.
 */
@Module({
  imports: [
    /**
     * Registers transfer repositories.
     */
    TypeOrmModule.forFeature([Transfer, TransferStatusHistory]),

    /**
     * Publishes transfer.requested to Ledger Service queue.
     */
    RabbitMqClientModule.register(LEDGER_EVENTS_QUEUE),
  ],
  controllers: [TransferController, TransferConsumer],
  providers: [TransferService, TransferPublisher],
})
export class TransferModule {}
