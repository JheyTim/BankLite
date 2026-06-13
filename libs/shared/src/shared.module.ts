import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { validateEnv } from './config';
import { HealthController } from './health';
import { AppLoggerService } from './logger';
import { CorrelationIdMiddleware } from './middleware';

// This module contains shared infrastructure used by every BankLite app.
// Each app imports SharedModule once in its AppModule.
@Module({
  imports: [
    ConfigModule.forRoot({
      // Make ConfigService available everywhere in the app without repeated imports.
      isGlobal: true,

      // Load local .env values.
      envFilePath: '.env',

      // Validate environment variables before the app starts.
      validate: validateEnv,
    }),

    // Terminus provides health check utilities.
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [AppLoggerService],
  exports: [ConfigModule, AppLoggerService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Apply correlation IDs to every route in every service.
      .apply(CorrelationIdMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
