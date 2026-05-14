import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { ProfileService } from './profile.service';
import { ProfileConsumer } from './profile.consumer';

/**
 * User profile module.
 */
@Module({
  imports: [
    /**
     * Registers the UserProfile repository.
     */
    TypeOrmModule.forFeature([UserProfile]),
  ],
  controllers: [ProfileConsumer],
  providers: [ProfileService],
})
export class ProfileModule {}
