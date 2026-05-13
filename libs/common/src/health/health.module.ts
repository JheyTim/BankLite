import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

/**
 * Reusable health module for all BankLite services.
 * Each service can import this module to expose health endpoints.
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class AppHealthModule {}
