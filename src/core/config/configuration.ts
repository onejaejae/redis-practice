import { Configurations, Env } from './index';

export const configurations = (): Configurations => {
  const env = (process.env.NODE_ENV ?? Env.local) as Env;

  return {
    APP: {
      NAME: process.env.NAME || '',
      BASE_URL: process.env.BASE_URL || '',
      PORT: process.env.PORT || 3000,
      NODE_ENV: process.env.NODE_ENV || 'local',
      ENV: env,
    },
    DB: {
      DB_HOST: process.env.DB_HOST || '',
      DB_USER_NAME: process.env.DB_USER_NAME || '',
      DB_PASSWORD: process.env.DB_PASSWORD || '',
      DB_DATABASE: process.env.DB_DATABASE || '',
      DB_PORT: process.env.DB_PORT || 5432,
    },
    MONGODB: {
      MONGODB_URI: process.env.MONGODB_URI || '',
      MONGODB_DATABASE: process.env.MONGODB_DATABASE || '',
    },
    REDIS: {
      HOST: process.env.REDIS_HOST || '',
      PORT: process.env.REDIS_PORT || 6379,
    },
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
      JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '',
      JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '',
    },
    LOKI: {
      LOKI_HOST: process.env.LOKI_HOST || '',
    },
  };
};
