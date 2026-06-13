import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../logger';
import { RequestWithCorrelationId } from '../middleware';
import { ApiErrorResponse } from '../types';

// This filter catches all thrown errors and returns one consistent error shape.
// It handles both Nest HttpException errors and unexpected runtime errors.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<RequestWithCorrelationId>();
    const response = httpContext.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.getErrorMessage(exceptionResponse, exception);
    const code = this.getErrorCode(exceptionResponse, statusCode);

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        statusCode,
        message,
        code,
        path: request.url,
        method: request.method,
        correlationId: request.correlationId ?? null,
        timestamp: new Date().toISOString(),
      },
    };

    // Log unexpected server errors with stack traces.
    // Client errors such as 400/404 are not logged as server errors.
    if (statusCode >= 500) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
        'HttpExceptionFilter',
      );
    }

    response.status(statusCode).json(payload);
  }

  private getErrorMessage(
    exceptionResponse: string | object | null,
    exception: unknown,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const responseWithMessage = exceptionResponse as {
        message: string | string[];
      };

      return responseWithMessage.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getErrorCode(
    exceptionResponse: string | object | null,
    statusCode: number,
  ): string {
    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'error' in exceptionResponse
    ) {
      const responseWithError = exceptionResponse as { error: string };

      return responseWithError.error.toUpperCase().replaceAll(' ', '_');
    }

    return `HTTP_${statusCode}`;
  }
}
