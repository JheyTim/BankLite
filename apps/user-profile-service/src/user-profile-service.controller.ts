import { Controller, Get } from '@nestjs/common';
import { UserProfileServiceService } from './user-profile-service.service';

@Controller()
export class UserProfileServiceController {
  constructor(private readonly userProfileServiceService: UserProfileServiceService) {}

  @Get()
  getHello(): string {
    return this.userProfileServiceService.getHello();
  }
}
