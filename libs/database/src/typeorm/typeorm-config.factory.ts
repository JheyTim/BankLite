import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Creates TypeORM configuration from environment variables.
 * Each service can pass its own entities and schema.
 */
export function createTypeOrmOptions(
  configService: ConfigService,
  entities: TypeOrmModuleOptions['entities'],
  schema: string,
): TypeOrmModuleOptions {
  return {
    /**
     * PostgreSQL is the relational database used by BankLite.
     */
    type: 'postgres',

    /**
     * Database host from environment variables.
     */
    host: configService.get<string>('POSTGRES_HOST', 'localhost'),

    /**
     * Database port from environment variables.
     */
    port: configService.get<number>('POSTGRES_PORT', 5432),

    /**
     * Database username.
     */
    username: configService.get<string>('POSTGRES_USER'),

    /**
     * Database password.
     */
    password: configService.get<string>('POSTGRES_PASSWORD'),

    /**
     * Database name.
     */
    database: configService.get<string>('POSTGRES_DB'),

    /**
     * Service-specific entities.
     */
    entities,

    /**
     * Service-owned schema.
     */
    schema,

    /**
     * Auto-create tables during local learning.
     * For production, replace this with migrations.
     */
    synchronize: true,

    /**
     * Keep SQL logging off by default to avoid noisy logs.
     */
    logging: false,
  };
}
