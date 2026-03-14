import { EnvironmentVariables } from './env.interface';

function readStringEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readNumberEnv(name: string, fallback?: number): number {
  const rawValue = process.env[name] ?? fallback?.toString();

  if (rawValue === undefined || rawValue.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsedValue;
}

export function readEnvironment(): EnvironmentVariables {
  return {
    PORT: readNumberEnv('PORT', 3000),
    NODE_ENV: readStringEnv('NODE_ENV', 'development'),
    DB_HOST: readStringEnv('DB_HOST', 'postgres'),
    DB_PORT: readNumberEnv('DB_PORT', 5432),
    DB_USERNAME: readStringEnv('DB_USERNAME', 'postgres'),
    DB_PASSWORD: readStringEnv('DB_PASSWORD', 'postgres'),
    DB_NAME: readStringEnv('DB_NAME', 'brain_agriculture'),
  };
}

export function isTestEnvironment(): boolean {
  return (process.env.NODE_ENV ?? 'development') === 'test';
}
