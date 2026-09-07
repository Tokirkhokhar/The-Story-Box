import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig } from './app.config';
import { getOsEnvOptional } from './env.config';

const isDevelopment = appConfig.environment === 'development';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: getOsEnvOptional('DATABASE_HOST') ?? 'localhost',
  port: +(getOsEnvOptional('DATABASE_PORT') ?? 5432),
  username: getOsEnvOptional('DATABASE_USER') ?? 'postgres',
  password: getOsEnvOptional('DATABASE_PASSWORD') ?? 'postgres',
  database: getOsEnvOptional('DATABASE_NAME') ?? 'thestorybox_db',
  synchronize: isDevelopment,
  migrationsRun: !isDevelopment,
  autoLoadEntities: true,
};
