import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';

@Module({
  imports: [SharedModule],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService],
})
export class AppModule {}
