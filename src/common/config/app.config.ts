import { registerAs } from '@nestjs/config';

import { readEnvironment } from './env.helper';

export const appConfig = registerAs('app', () => {
  const env = readEnvironment();

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    serviceName: 'brain-agriculture-api',
  };
});
