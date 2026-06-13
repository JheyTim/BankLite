import { describe, expect, it } from 'vitest';
import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('returns defaults when optional environment values are missing', () => {
    // Arrange: provide only the required environment values.
    const rawEnv = {};

    // Act: validate and normalize the environment.
    const env = validateEnv(rawEnv);

    // Assert: defaults should be applied.
    expect(env.NODE_ENV).toBe('development');
    expect(env.API_GATEWAY_PORT).toBe(3000);
    expect(env.POSTGRES_DB).toBe('banklite');
  });

  it('throws an error when NODE_ENV is invalid', () => {
    // Arrange: provide an unsupported NODE_ENV value.
    const rawEnv = {
      NODE_ENV: 'invalid-env',
    };

    // Act + Assert: validation should fail fast.
    expect(() => validateEnv(rawEnv)).toThrow('Environment validation failed');
  });
});
