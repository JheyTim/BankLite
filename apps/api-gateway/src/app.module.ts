import { Module } from '@nestjs/common';
import { AppConfigModule, AppHealthModule } from '@app/common';

/**
 * Root module for the API Gateway.
 * The gateway is the public HTTP entry point for BankLite.
 */
@Module({
  imports: [
    /**
     * Loads and validates environment variables.
     */
    AppConfigModule,

    /**
     * Adds /health/live and /health/ready endpoints.
     */
    AppHealthModule,
  ],
})
export class AppModule {}
