import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { Account } from './accounts/entities/account.entity';
import { AccountStatusHistory } from './accounts/entities/account-status-history.entity';
import { AccountModule } from './accounts/account.module';

/**
 * Root module for Account Service.
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
     * Connects Account Service to PostgreSQL using account_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(
          configService,
          [Account, AccountStatusHistory],
          'account_schema',
        ),
    }),

    /**
     * Account feature module.
     */
    AccountModule,
  ],
})
export class AppModule {}
