import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';

@Module({
  imports: [SharedModule],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class AppModule {}
