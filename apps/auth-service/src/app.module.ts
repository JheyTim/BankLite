import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

@Module({
  imports: [SharedModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AppModule {}
