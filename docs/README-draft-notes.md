# BankLite Draft Notes

This file stores notes while we build the project.

The final README.md will be written after all services are completed so it accurately documents the real architecture, commands, environment variables, Docker setup, Kubernetes setup, and testing workflow.

## Services

- api-gateway
- auth-service
- user-service
- account-service
- wallet-service
- ledger-service
- transaction-service
- notification-service
- audit-service

## Shared Libraries

- shared
- contracts
- testing

## Phase 4 — Shared Backend Foundation

Added shared backend infrastructure in `libs/shared`.

### Included

- Environment validation with `@nestjs/config` and Joi
- Global validation pipe
- JSON logger
- Correlation ID middleware
- Standard success response interceptor
- Standard error response filter
- Health endpoints:
  - `/health`
  - `/health/live`
  - `/health/ready`
- Shared service name constants
- Basic Vitest test for environment validation

### Notes

Each app imports `SharedModule`.

Each app calls `configureHttpApp(app)` in `main.ts`.

The system now has consistent request IDs, logs, error responses, success responses, and health endpoints.
