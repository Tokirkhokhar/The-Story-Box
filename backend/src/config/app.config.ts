import { getOsEnvOptional } from './env.config';

export const appConfig = {
  port: +(getOsEnvOptional('PORT') ?? 3000),
  environment: getOsEnvOptional('ENVIRONMENT') ?? 'development',
};
