import * as Joi from 'joi';

// This schema validates environment variables at application startup.
// If a required or invalid value is found, the app fails fast instead of breaking later at runtime.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  // SERVICE_NAME is useful for logs, metrics, traces, and health responses.
  SERVICE_NAME: Joi.string().default('banklite-service'),

  // API Gateway
  API_GATEWAY_PORT: Joi.number().port().default(3000),

  // Internal service ports
  AUTH_SERVICE_PORT: Joi.number().port().default(3001),
  USER_SERVICE_PORT: Joi.number().port().default(3002),
  ACCOUNT_SERVICE_PORT: Joi.number().port().default(3003),
  WALLET_SERVICE_PORT: Joi.number().port().default(3004),
  LEDGER_SERVICE_PORT: Joi.number().port().default(3005),
  TRANSACTION_SERVICE_PORT: Joi.number().port().default(3006),
  NOTIFICATION_SERVICE_PORT: Joi.number().port().default(3007),
  AUDIT_SERVICE_PORT: Joi.number().port().default(3008),

  // PostgreSQL
  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_PORT: Joi.number().port().default(5432),
  POSTGRES_USER: Joi.string().default('banklite'),
  POSTGRES_PASSWORD: Joi.string().default('banklite_password'),
  POSTGRES_DB: Joi.string().default('banklite'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),

  // RabbitMQ
  RABBITMQ_HOST: Joi.string().default('localhost'),
  RABBITMQ_PORT: Joi.number().port().default(5672),
  RABBITMQ_MANAGEMENT_PORT: Joi.number().port().default(15672),
  RABBITMQ_DEFAULT_USER: Joi.string().default('banklite'),
  RABBITMQ_DEFAULT_PASS: Joi.string().default('banklite_password'),
  RABBITMQ_DEFAULT_VHOST: Joi.string().default('banklite'),
  RABBITMQ_URL: Joi.string()
    .uri({
      scheme: ['amqp', 'amqps'],
    })
    .default('amqp://banklite:banklite_password@localhost:5672/banklite'),

  // Floci local AWS-compatible emulator
  FLOCI_PORT: Joi.number().port().default(4566),
  FLOCI_ENDPOINT: Joi.string().uri().default('http://localhost:4566'),
  FLOCI_REGION: Joi.string().default('us-east-1'),
  FLOCI_ACCESS_KEY_ID: Joi.string().default('test'),
  FLOCI_SECRET_ACCESS_KEY: Joi.string().default('test'),

  // Prometheus
  PROMETHEUS_PORT: Joi.number().port().default(9090),

  // Grafana
  GRAFANA_PORT: Joi.number().port().default(3009),
  GRAFANA_ADMIN_USER: Joi.string().default('admin'),
  GRAFANA_ADMIN_PASSWORD: Joi.string().default('admin'),

  // Logging
  LOG_LEVEL: Joi.string().valid('debug', 'log', 'warn', 'error').default('log'),
});

// This function is passed to ConfigModule.
// It validates the environment and returns normalized values.
export function validateEnv(config: Record<string, unknown>) {
  const result = envValidationSchema.validate(config, {
    // Show all validation errors at once instead of stopping at the first error.
    abortEarly: false,

    // Allow extra environment variables from the OS, Docker, or CI provider.
    allowUnknown: true,
  });
  const { error, value } = result as {
    error?: Joi.ValidationError;
    value: Record<string, unknown>;
  };

  if (error) {
    // Throwing here prevents the app from starting with invalid config.
    throw new Error(`Environment validation failed: ${error.message}`);
  }

  return value;
}
