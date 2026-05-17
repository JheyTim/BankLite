import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';

/**
 * Global configuration module used by all BankLite services.
 * This loads environment variables and validates them at startup.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      /**
       * Makes ConfigService available throughout the app.
       */
      isGlobal: true,

      /**
       * Reads variables from .env during local development.
       */
      envFilePath: '.env',

      /**
       * Validates required environment variables before the app starts.
       */
      validationSchema: envValidationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
