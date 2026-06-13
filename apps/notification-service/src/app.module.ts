import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

@Module({
  imports: [SharedModule],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class AppModule {}
