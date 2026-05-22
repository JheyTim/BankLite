import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { AccountBalance } from './ledger/entities/account-balance.entity';
import { LedgerEntry } from './ledger/entities/ledger-entry.entity';
import { LedgerTransaction } from './ledger/entities/ledger-transaction.entity';
import { LedgerModule } from './ledger/ledger.module';

/**
 * Root module for Ledger Service.
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
     * Connects Ledger Service to PostgreSQL using ledger_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(
          configService,
          [AccountBalance, LedgerEntry, LedgerTransaction],
          'ledger_schema',
        ),
    }),

    /**
     * Ledger feature module.
     */
    LedgerModule,
  ],
})
export class AppModule {}
