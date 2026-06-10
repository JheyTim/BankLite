import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { Transfer } from './transfers/entities/transfer.entity';
import { TransferStatusHistory } from './transfers/entities/transfer-status-history.entity';
import { TransferModule } from './transfers/transfer.module';

/**
 * Root module for Transfer Service.
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
     * Connects Transfer Service to PostgreSQL using transfer_schema.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(
          configService,
          [Transfer, TransferStatusHistory],
          'transfer_schema',
        ),
    }),

    /**
     * Transfer feature module.
     */
    TransferModule,
  ],
})
export class AppModule {}
