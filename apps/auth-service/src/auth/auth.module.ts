import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, PROFILE_EVENTS_QUEUE } from '@app/messaging';
import { AuthUser } from '../users/entities/auth-user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthPublisher } from './auth.publisher';
import type { StringValue } from 'ms';

/**
 * Auth module for registration and login.
 */
@Module({
  imports: [
    /**
     * Registers the AuthUser repository.
     */
    TypeOrmModule.forFeature([AuthUser]),

    /**
     * JWT module configured from environment variables.
     */
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN', '15m'),
        },
      }),
    }),

    /**
     * RabbitMQ publisher client.
     */
    RabbitMqClientModule.register(PROFILE_EVENTS_QUEUE),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthPublisher],
})
export class AuthModule {}
