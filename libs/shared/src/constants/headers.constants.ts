// This header carries the request correlation ID across services.
// It helps us trace one user action across API Gateway, services, logs, and messages.
export const CORRELATION_ID_HEADER = 'x-correlation-id';
