export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL?: string;
  DB_SSL: boolean;
  DB_SSL_REJECT_UNAUTHORIZED: boolean;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}
