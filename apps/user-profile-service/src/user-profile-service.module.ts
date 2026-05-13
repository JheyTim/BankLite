import { Module } from '@nestjs/common';
import { UserProfileServiceController } from './user-profile-service.controller';
import { UserProfileServiceService } from './user-profile-service.service';

@Module({
  imports: [],
  controllers: [UserProfileServiceController],
  providers: [UserProfileServiceService],
})
export class UserProfileServiceModule {}
