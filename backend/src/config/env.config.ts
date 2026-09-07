import { config } from 'dotenv';

config({ override: false });

export const getOsEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const getOsEnvOptional = (key: string): string | undefined => {
  return process.env[key];
};

export const toBoolean = (value: string): boolean => {
  return value === 'true';
};
