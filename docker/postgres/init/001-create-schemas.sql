-- Auth Service owns authentication-related data.
CREATE SCHEMA IF NOT EXISTS auth_schema;

-- User Profile Service owns user profile data.
CREATE SCHEMA IF NOT EXISTS profile_schema;

-- KYC Service owns verification cases and documents.
CREATE SCHEMA IF NOT EXISTS kyc_schema;

-- Account Service owns bank account metadata.
CREATE SCHEMA IF NOT EXISTS account_schema;

-- Ledger Service owns ledger transactions and entries.
CREATE SCHEMA IF NOT EXISTS ledger_schema;

-- Transfer Service owns transfer request records.
CREATE SCHEMA IF NOT EXISTS transfer_schema;

-- Bill Payment Service owns billers and payment requests.
CREATE SCHEMA IF NOT EXISTS bill_payment_schema;

-- Fraud Service owns fraud alerts and review data.
CREATE SCHEMA IF NOT EXISTS fraud_schema;

-- Notification Service owns notification records.
CREATE SCHEMA IF NOT EXISTS notification_schema;

-- File Service owns uploaded file metadata.
CREATE SCHEMA IF NOT EXISTS file_schema;

-- Audit Log Service owns immutable audit records.
CREATE SCHEMA IF NOT EXISTS audit_schema;