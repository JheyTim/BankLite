import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { KycCase } from './kyc/entities/kyc-case.entity';
import { KycDocument } from './kyc/entities/kyc-document.entity';
import { KycModule } from './kyc/kyc.module';

/**
 * Root module for KYC Service.
 */
@Module({
  imports: [
    AppConfigModule,
    AppHealthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(
          configService,
          [KycCase, KycDocument],
          'kyc_schema',
        ),
    }),
    KycModule,
  ],
})
export class AppModule {}
