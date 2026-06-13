import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

// AppModule is the root module of the API Gateway.
// SharedModule gives this app config validation, health endpoints, logging, and request IDs.
@Module({
  imports: [SharedModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class AppModule {}
