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
```

## Local Infrastructure

BankLite uses Docker Compose for local infrastructure.

Services:

- PostgreSQL on port `5432`
- Redis on port `6379`
- RabbitMQ broker on port `5672`
- RabbitMQ Management UI on port `15672`
- Floci local AWS-compatible endpoint on port `4566`

Start infrastructure:

```bash
npm run infra:up
```

## Auth Service

Start Auth Service:

```bash
npm run start:dev auth-service
```

Register:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "timothy@example.com",
    "fullName": "Timothy Jhey",
    "password": "password123",
    "role": "USER"
  }'
```

Login:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "timothy@example.com",
    "password": "password123"
  }'
```

## User Profile Service

```bash
npm run start:dev user-profile-service
```

The profile service consumes the user.registered event and creates a profile record.

## File Service

Start File Service:

```bash
npm run start:dev file-service
```

Upload a KYC document:

```bash
curl -X POST http://localhost:3010/files/kyc-documents \
  -F "userId=PASTE_USER_ID_HERE" \
  -F "documentType=GOVERNMENT_ID" \
  -F "file=@sample-kyc.txt"
```

## KYC Service

Start KYC Service:

```bash
npm run start:dev kyc-service
```

List KYC cases:

```bash
curl http://localhost:3003/kyc/cases
```

Approve KYC:

```bash
curl -X PATCH http://localhost:3003/kyc/cases/PASTE_KYC_CASE_ID_HERE/approve \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedByUserId": "PASTE_REVIEWER_USER_ID_HERE"
  }'
```

Reject KYC:

```bash
curl -X PATCH http://localhost:3003/kyc/cases/PASTE_KYC_CASE_ID_HERE/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedByUserId": "PASTE_REVIEWER_USER_ID_HERE",
    "reason": "Document is unreadable."
  }'

```
