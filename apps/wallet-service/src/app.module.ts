import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';

@Module({
  imports: [SharedModule],
  controllers: [WalletServiceController],
  providers: [WalletServiceService],
})
export class AppModule {}
