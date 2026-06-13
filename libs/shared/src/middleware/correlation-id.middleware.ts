import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../constants';

// Extend the Express Request type so our code knows correlationId exists.
export type RequestWithCorrelationId = Request & {
  correlationId?: string;
};

// This middleware ensures every incoming request has a correlation ID.
// If the client sends x-correlation-id, we reuse it.
// If not, we generate a new UUID.
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: RequestWithCorrelationId, res: Response, next: NextFunction) {
    const incomingCorrelationId = req.header(CORRELATION_ID_HEADER);

    const correlationId =
      incomingCorrelationId && incomingCorrelationId.trim().length > 0
        ? incomingCorrelationId
        : randomUUID();

    // Store it on the request so filters/interceptors/controllers can use it.
    req.correlationId = correlationId;

    // Echo it back in the response headers so clients can report it when debugging.
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
