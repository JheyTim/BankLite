import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { AccountServiceController } from './account-service.controller';
import { AccountServiceService } from './account-service.service';

// AppModule is the root module of the API Gateway.
// SharedModule gives this app config validation, health endpoints, logging, and request IDs.
@Module({
  imports: [SharedModule],
  controllers: [AccountServiceController],
  providers: [AccountServiceService],
})
export class AppModule {}
