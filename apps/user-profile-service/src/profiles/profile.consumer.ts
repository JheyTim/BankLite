import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { UserRegisteredEvent } from '@app/contracts';
import { ProfileService } from './profile.service';

/**
 * Consumes user-related events.
 */
@Controller()
export class ProfileConsumer {
  constructor(
    /**
     * Contains profile business logic.
     */
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Runs whenever Auth Service publishes user.registered.
   */
  @EventPattern('user.registered')
  async handleUserRegistered(@Payload() event: UserRegisteredEvent) {
    await this.profileService.createProfileFromUserRegistered(event);
  }
}
