import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { LedgerServiceController } from './ledger-service.controller';
import { LedgerServiceService } from './ledger-service.service';

@Module({
  imports: [SharedModule],
  controllers: [LedgerServiceController],
  providers: [LedgerServiceService],
})
export class AppModule {}
