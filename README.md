# BankLite

BankLite is a production-style digital banking backend built with TypeScript, NestJS, PostgreSQL, Redis, RabbitMQ, Docker, Kubernetes, centralized logging, and local AWS-compatible storage through Floci.

---

## Project Goals

- Practice microservices architecture.
- Build banking-style account and ledger workflows.
- Use event-driven communication through RabbitMQ.
- Use Redis for locks, rate limiting, idempotency, and fraud counters.
- Use PostgreSQL for service-owned data.
- Use Floci for local AWS-style file storage.
- Practice Docker and Kubernetes deployment patterns.
- Add comments to non-obvious code for learning.

---

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

---

## Shared Libraries

- common
- contracts
- database
- logger
- messaging
- redis

---

## Local Development

### Install dependencies:

```bash
npm install
```

---

## Local Infrastructure

BankLite uses Docker Compose for local infrastructure.

### Services:

- PostgreSQL on port `5432`
- Redis on port `6379`
- RabbitMQ broker on port `5672`
- RabbitMQ Management UI on port `15672`
- Floci local AWS-compatible endpoint on port `4566`

### Start infrastructure:

```bash
npm run infra:up
```

---

## Auth Service

### Start Auth Service:

```bash
npm run start:dev auth-service
```

### Register:

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

### Login:

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

---

## File Service

### Start File Service:

```bash
npm run start:dev file-service
```

### Upload a KYC document:

```bash
curl -X POST http://localhost:3010/files/kyc-documents \
  -F "userId=PASTE_USER_ID_HERE" \
  -F "documentType=GOVERNMENT_ID" \
  -F "file=@sample-kyc.txt"
```

---

## KYC Service

### Start KYC Service:

```bash
npm run start:dev kyc-service
```

### List KYC cases:

```bash
curl http://localhost:3003/kyc/cases
```

### Approve KYC:

```bash
curl -X PATCH http://localhost:3003/kyc/cases/PASTE_KYC_CASE_ID_HERE/approve \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedByUserId": "PASTE_REVIEWER_USER_ID_HERE"
  }'
```

### Reject KYC:

```bash
curl -X PATCH http://localhost:3003/kyc/cases/PASTE_KYC_CASE_ID_HERE/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedByUserId": "PASTE_REVIEWER_USER_ID_HERE",
    "reason": "Document is unreadable."
  }'
```

---

## Account Service

### Start Account Service:

```bash
npm run start:dev account-service
```

The Account Service consumes the kyc.verified event and creates a default active PHP savings account.

### List accounts by user:

```bash
curl http://localhost:3004/accounts/users/PASTE_USER_ID_HERE
```

### Get account by ID:

```bash
curl http://localhost:3004/accounts/PASTE_ACCOUNT_ID_HERE
```

### Get account status history:

```bash
curl http://localhost:3004/accounts/PASTE_ACCOUNT_ID_HERE/status-history
```

### Account creation flow:

```txt
kyc.verified
    ↓
account-service creates ACTIVE savings account
    ↓
account.created
    ↓
account.activated
```

---

## Ledger Service

### Start Ledger Service:

```bash
npm run start:dev ledger-service
```

The Ledger Service owns account balances and append-only ledger entries.

When Account Service publishes account.activated, Ledger Service creates a zero balance row.

### Get account balance:

```bash
curl http://localhost:3005/ledger/balances/PASTE_ACCOUNT_ID_HERE
```

### List ledger entries:

```bash
curl http://localhost:3005/ledger/accounts/PASTE_ACCOUNT_ID_HERE/entries
```

### Create local test deposit:

```bash
curl -X POST http://localhost:3005/ledger/deposits \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "PASTE_ACCOUNT_ID_HERE",
    "amountMinor": 100000,
    "currency": "PHP"
  }'
```

### Create local test transfer posting:

```bash
curl -X POST http://localhost:3005/ledger/transfer-postings \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "PASTE_FIRST_ACCOUNT_ID_HERE",
    "toAccountId": "PASTE_SECOND_ACCOUNT_ID_HERE",
    "amountMinor": 25000,
    "currency": "PHP"
  }'
```

### Ledger rules:

- Never update balances without ledger entries.
- Store money as minor units.
- Every money movement must have debit and credit entries.
- ledger_entries is append-only.
- account_balances is a fast-read cache.

---

## Transfer Service

Start Transfer Service:

```bash
npm run start:dev transfer-service
```

### Create transfer:

```bash
curl -X POST http://localhost:3006/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "PASTE_SENDER_USER_ID_HERE",
    "fromAccountId": "PASTE_SENDER_ACCOUNT_ID_HERE",
    "toAccountId": "PASTE_RECEIVER_ACCOUNT_ID_HERE",
    "amountMinor": 25000,
    "currency": "PHP",
    "idempotencyKey": "transfer-test-001"
  }'
```

### Get transfer:

```bash
curl http://localhost:3006/transfers/PASTE_TRANSFER_ID_HERE
```

### List transfers by user:

```bash
curl http://localhost:3006/transfers/users/PASTE_USER_ID_HERE
```

### Get transfer status history:

```bash
curl http://localhost:3006/transfers/PASTE_TRANSFER_ID_HERE/status-history
```

### Transfer flow:

```txt
POST /transfers
    ↓
transfer-service saves PROCESSING transfer
    ↓
transfer.requested
    ↓
ledger-service creates debit and credit entries
    ↓
ledger.posted or ledger.failed
    ↓
transfer-service marks transfer COMPLETED or FAILED
```

### Rules:

```txt
- Every transfer requires an idempotency key.
- Transfer Service does not update balances.
- Ledger Service owns all money movement.
- Duplicate idempotency keys return the existing transfer.
```

---

## Bill Payment Service

### Start Bill Payment Service:

```bash
npm run start:dev bill-payment-service
```

### Create a biller:

```bash
curl -X POST http://localhost:3007/billers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meralco",
    "category": "ELECTRICITY"
  }'
```

### List Billers:

```bash
curl http://localhost:3007/billers
```

### Create bill payment:

```bash
curl -X POST http://localhost:3007/bill-payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "PASTE_USER_ID_HERE",
    "fromAccountId": "PASTE_ACCOUNT_ID_HERE",
    "billerId": "PASTE_BILLER_ID_HERE",
    "billerReferenceNumber": "MERALCO-123456789",
    "amountMinor": 35000,
    "currency": "PHP",
    "idempotencyKey": "bill-payment-test-001"
  }'
```

### Get bill payment:

```bash
curl http://localhost:3007/bill-payments/PASTE_BILL_PAYMENT_ID_HERE
```

### List bill payments by user:

```bash
curl http://localhost:3007/bill-payments/users/PASTE_USER_ID_HERE
```

### Get bill payment status history:

```bash
curl http://localhost:3007/bill-payments/PASTE_BILL_PAYMENT_ID_HERE/status-history
```

### Bill payment flow:

```txt
POST /bill-payments
    ↓
bill-payment-service saves PROCESSING payment
    ↓
bill.payment.requested
    ↓
ledger-service debits user account
    ↓
ledger.posted or ledger.failed
    ↓
bill-payment-service marks payment PAID or FAILED
```

### Rules

```txt
- Every bill payment requires an idempotency key.
- Bill Payment Service does not update balances.
- Ledger Service owns all money movement.
- Duplicate idempotency keys return the existing bill payment.
```

---

## Fraud Rules

Fraud Rules run before Transfer Service or Bill Payment Service publishes events to Ledger Service.

```txt
Transfer or bill payment request
    ↓
Fraud rules check
    ↓
Allowed: publish to Ledger
Blocked: mark transaction FAILED
```

### Rules:

```txt
- Block PHP transactions above 50,000 PHP.
- Block USD transactions above 1,000 USD.
- Block transfers where fromAccountId equals toAccountId.
- Store riskScore.
- Store fraudReason.
- Blocked transactions must not create ledger transactions.
```

---
