// These service names must stay consistent across logs, metrics, events, and Docker/Kubernetes config.
export const BANKLITE_SERVICES = {
  API_GATEWAY: 'api-gateway',
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  ACCOUNT_SERVICE: 'account-service',
  WALLET_SERVICE: 'wallet-service',
  LEDGER_SERVICE: 'ledger-service',
  TRANSACTION_SERVICE: 'transaction-service',
  NOTIFICATION_SERVICE: 'notification-service',
  AUDIT_SERVICE: 'audit-service',
} as const;

// This type gives us autocomplete and type safety when using a BankLite service name.
export type BankLiteServiceName =
  (typeof BANKLITE_SERVICES)[keyof typeof BANKLITE_SERVICES];
