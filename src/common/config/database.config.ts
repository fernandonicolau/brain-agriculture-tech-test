import { registerAs } from '@nestjs/config';

import { readEnvironment } from './env.helper';

export const databaseConfig = registerAs('database', () => {
  const env = readEnvironment();

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  };
});
