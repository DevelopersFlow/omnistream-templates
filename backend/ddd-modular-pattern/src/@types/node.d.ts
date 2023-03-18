declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    PORT: number;
    NODE_ENV: 'development' | 'testing' | 'staging' | 'production';

    APP_API_URL: string;
    APP_WEB_URL: string;

    MAIN_DB_TYPE: string;
    MAIN_DB_HOST: string;
    MAIN_DB_PORT: number;
    MAIN_DB_USER: string;
    MAIN_DB_PASS: string;
    MAIN_DATABASE: string;

    MONGO_DB_TYPE: string;
    MONGO_DB_HOST: string;
    MONGO_DB_PORT: number;
    MONGO_DB_USER: string;
    MONGO_DB_PASS: string;
    MONGO_DATABASE: string;

    REDIS_DB_HOST: string;
    REDIS_DB_PORT: number;
    REDIS_DB_PASS: string;

    JWT_SECRET_TOKEN: string;
    JWT_EXPIRES_IN_SECRET_TOKEN: string;
    JWT_SECRET_REFRESH_TOKEN: string;
    JWT_EXPIRES_IN_REFRESH_TOKEN: string;

    STORAGE_DRIVER: 'disk' | 's3';
    STORAGE_BUCKET: string;
    STORAGE_BUCKET_URL: string;

    MAIL_DRIVER: 'ethereal' | 'ses';

    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_DEFAULT_REGION: string;

    SENTRY_DSN: string;

    POPULATE_DEV_SEEDS: 'true' | 'false';
  }
}
