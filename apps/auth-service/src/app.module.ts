import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { AuthUser } from './users/entities/auth-user.entity';
import { AuthModule } from './auth/auth.module';

/**
 * Root module for Auth Service.
 */
@Module({
  imports: [
    /**
     * Loads and validates environment variables.
     */
    AppConfigModule,

    /**
     * Exposes /health/live and /health/ready.
     */
    AppHealthModule,

    /**
     * Connects Auth Service to PostgreSQL using auth_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, [AuthUser], 'auth_schema'),
    }),

    /**
     * Auth feature module.
     */
    AuthModule,
  ],
})
export class AppModule {}
