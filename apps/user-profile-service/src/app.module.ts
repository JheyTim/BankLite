import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { UserProfile } from './profiles/entities/user-profile.entity';
import { ProfileModule } from './profiles/profile.module';

/**
 * Root module for User Profile Service.
 */
@Module({
  imports: [
    /**
     * Loads and validates environment variables.
     */
    AppConfigModule,

    /**
     * Exposes health endpoints if this service runs over HTTP later.
     */
    AppHealthModule,

    /**
     * Connects User Profile Service to PostgreSQL using profile_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, [UserProfile], 'profile_schema'),
    }),

    /**
     * Profile feature module.
     */
    ProfileModule,
  ],
})
export class AppModule {}
