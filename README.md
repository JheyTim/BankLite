# BankLite

BankLite is a production-style digital banking backend built with TypeScript, NestJS, PostgreSQL, Redis, RabbitMQ, Docker, Kubernetes, centralized logging, and local AWS-compatible storage through Floci.

## Project Goals

- Practice microservices architecture.
- Build banking-style account and ledger workflows.
- Use event-driven communication through RabbitMQ.
- Use Redis for locks, rate limiting, idempotency, and fraud counters.
- Use PostgreSQL for service-owned data.
- Use Floci for local AWS-style file storage.
- Practice Docker and Kubernetes deployment patterns.
- Add comments to non-obvious code for learning.

## Services

- api-gateway
- auth-service
- user-profile-service
- kyc-service
- account-service
- ledger-service
- transfer-service
- bill-payment-service
- fraud-service
- notification-service
- file-service
- audit-log-service

## Shared Libraries

- common
- contracts
- database
- logger
- messaging
- redis

## Local Development

Install dependencies:

```bash
npm install