import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, ACCOUNT_EVENTS_QUEUE } from '@app/messaging';
import { KycCase } from './entities/kyc-case.entity';
import { KycDocument } from './entities/kyc-document.entity';
import { KycController } from './kyc.controller';
import { KycConsumer } from './kyc.consumer';
import { KycService } from './kyc.service';
import { KycPublisher } from './kyc.publisher';

/**
 * KYC module for document review and verification.
 */
@Module({
  imports: [
    /**
     * Registers KYC repositories.
     */
    TypeOrmModule.forFeature([KycCase, KycDocument]),

    /**
     * Publishes kyc.verified and kyc.rejected events to Account Service queue.
     */
    RabbitMqClientModule.register(ACCOUNT_EVENTS_QUEUE),
  ],
  controllers: [KycController, KycConsumer],
  providers: [KycService, KycPublisher],
})
export class KycModule {}
