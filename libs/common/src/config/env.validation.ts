import * as Joi from 'joi';

/**
 * Validates environment variables when the app starts.
 * This helps fail fast when required config values are missing.
 */
export const envValidationSchema = Joi.object({
  /**
   * Runtime environment.
   */
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  /**
   * API Gateway HTTP port.
   */
  API_GATEWAY_PORT: Joi.number().default(3000),

  /**
   * Internal service ports.
   */
  AUTH_SERVICE_PORT: Joi.number().default(3001),
  USER_PROFILE_SERVICE_PORT: Joi.number().default(3002),
  KYC_SERVICE_PORT: Joi.number().default(3003),
  ACCOUNT_SERVICE_PORT: Joi.number().default(3004),
  LEDGER_SERVICE_PORT: Joi.number().default(3005),
  TRANSFER_SERVICE_PORT: Joi.number().default(3006),
  BILL_PAYMENT_SERVICE_PORT: Joi.number().default(3007),
  FRAUD_SERVICE_PORT: Joi.number().default(3008),
  NOTIFICATION_SERVICE_PORT: Joi.number().default(3009),
  FILE_SERVICE_PORT: Joi.number().default(3010),
  AUDIT_LOG_SERVICE_PORT: Joi.number().default(3011),

  /**
   * JWT settings.
   */
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),

  /**
   * PostgreSQL settings.
   */
  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  /**
   * Redis settings.
   */
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  /**
   * RabbitMQ settings.
   */
  RABBITMQ_URL: Joi.string().required(),

  /**
   * Local AWS-compatible settings for Floci.
   */
  AWS_REGION: Joi.string().default('ap-southeast-1'),
  AWS_ENDPOINT: Joi.string().default('http://localhost:4566'),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
});
