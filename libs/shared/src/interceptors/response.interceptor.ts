import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../types';
import { RequestWithCorrelationId } from '../middleware';

// This interceptor wraps every successful HTTP response in a consistent shape.
// It does not handle errors; errors are handled by HttpExceptionFilter.
@Injectable()
export class ResponseInterceptor<TData> implements NestInterceptor<
  TData,
  ApiSuccessResponse<TData>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<ApiSuccessResponse<TData>> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithCorrelationId>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          correlationId: request.correlationId ?? null,
        },
      })),
    );
  }
}
