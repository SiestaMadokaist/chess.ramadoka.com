import { PhantomString, ST } from './types';
import { get } from 'http';

export interface ENV {
  NODE_ENV: 'development' | 'production' | 'spec';
  SSR: 'true' | 'false';
  PORT: '3000';
}

const customEnv: ENV = {
  NODE_ENV: 'production',
  SSR: 'false',
  PORT: '3000',
};

function getEnv<K extends (keyof ENV)>(key: K): { [k in K]: ENV[K] } {
  const value = process.env[key] || customEnv[key];
  if (typeof value !== 'undefined') { return { [key]: value } as { [k in K]: ENV[K] }; }
  throw new Error(`missing value: ${key} in env`);
}

function initializeEnv(): ENV {
  const defaults = {};
  return {
    ...defaults,
    ...getEnv('NODE_ENV'),
    ...getEnv('SSR'),
    ...getEnv('PORT'),
  };
}

export const env = initializeEnv();
