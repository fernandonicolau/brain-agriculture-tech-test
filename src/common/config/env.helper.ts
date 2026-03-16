import { EnvironmentVariables } from './env.interface';

function readStringEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalStringEnv(name: string): string | undefined {
  const value = process.env[name];

  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue === '' ? undefined : trimmedValue;
}

function readBooleanEnv(name: string, fallback = false): boolean {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue.trim() === '') {
    return fallback;
  }

  const normalizedValue = rawValue.trim().toLowerCase();

  if (['true', '1', 'yes', 'y', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'n', 'off'].includes(normalizedValue)) {
    return false;
  }

  throw new Error(`Environment variable ${name} must be a valid boolean`);
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

function readDatabaseConfigFromUrl(
  databaseUrl: string,
): Pick<EnvironmentVariables, 'DB_HOST' | 'DB_PORT' | 'DB_USERNAME' | 'DB_PASSWORD' | 'DB_NAME'> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error('Environment variable DATABASE_URL must be a valid URL');
  }

  if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
    throw new Error('Environment variable DATABASE_URL must use postgres or postgresql protocol');
  }

  const databaseName = parsedUrl.pathname.replace(/^\//, '');

  if (!databaseName) {
    throw new Error('Environment variable DATABASE_URL must include a database name');
  }

  return {
    DB_HOST: parsedUrl.hostname,
    DB_PORT: parsedUrl.port ? Number(parsedUrl.port) : 5432,
    DB_USERNAME: decodeURIComponent(parsedUrl.username),
    DB_PASSWORD: decodeURIComponent(parsedUrl.password),
    DB_NAME: decodeURIComponent(databaseName),
  };
}

export function readEnvironment(): EnvironmentVariables {
  const databaseUrl = readOptionalStringEnv('DATABASE_URL');
  const databaseConfig = databaseUrl
    ? readDatabaseConfigFromUrl(databaseUrl)
    : {
        DB_HOST: readStringEnv('DB_HOST', 'postgres'),
        DB_PORT: readNumberEnv('DB_PORT', 5432),
        DB_USERNAME: readStringEnv('DB_USERNAME', 'postgres'),
        DB_PASSWORD: readStringEnv('DB_PASSWORD', 'postgres'),
        DB_NAME: readStringEnv('DB_NAME', 'brain_agriculture'),
      };

  return {
    PORT: readNumberEnv('PORT', 3000),
    NODE_ENV: readStringEnv('NODE_ENV', 'development'),
    DATABASE_URL: databaseUrl,
    DB_SSL: readBooleanEnv('DB_SSL', false),
    DB_SSL_REJECT_UNAUTHORIZED: readBooleanEnv('DB_SSL_REJECT_UNAUTHORIZED', false),
    ...databaseConfig,
  };
}

export function isTestEnvironment(): boolean {
  return (process.env.NODE_ENV ?? 'development') === 'test';
}
