import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisteredEvent } from '@app/contracts';
import { UserProfile } from './entities/user-profile.entity';

/**
 * Contains profile business logic.
 */
@Injectable()
export class ProfileService {
  constructor(
    /**
     * Repository for profile records.
     */
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Creates a profile from a user.registered event.
   * This handler is idempotent by checking if the profile already exists.
   */
  async createProfileFromUserRegistered(event: UserRegisteredEvent) {
    /**
     * Check if this profile already exists.
     */
    const existingProfile = await this.profileRepository.findOne({
      where: { userId: event.userId },
    });

    /**
     * If it exists, return it instead of creating a duplicate.
     */
    if (existingProfile) {
      return existingProfile;
    }

    /**
     * Create the profile from event data.
     */
    const profile = this.profileRepository.create({
      userId: event.userId,
      email: event.email,
      fullName: event.fullName,
      role: event.role,
    });

    /**
     * Save the profile to PostgreSQL.
     */
    return this.profileRepository.save(profile);
  }
}
