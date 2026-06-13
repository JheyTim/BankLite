import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppLoggerService } from '../logger';
import { HttpExceptionFilter } from '../filters';
import { ResponseInterceptor } from '../interceptors';

// This function applies common HTTP behavior to every NestJS app.
// We call this from each app's main.ts file.
export function configureHttpApp(app: INestApplication) {
  const logger = app.get(AppLoggerService);

  // Tell Nest to use our JSON logger instead of the default logger.
  app.useLogger(logger);

  // Validate incoming DTOs automatically.
  // whitelist removes properties that are not part of the DTO.
  // forbidNonWhitelisted rejects requests that include unknown fields.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Format every thrown error using our standard error response.
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Format every successful response using our standard success response.
  app.useGlobalInterceptors(new ResponseInterceptor());
}
