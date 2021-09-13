import dotenv from 'dotenv';

dotenv.config();

export const env = {
    APP_PORT: process.env.APP_PORT,
    APP_ENV: process.env.APP_ENV,
    APP_KEY: process.env.APP_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
    WEB_URL: process.env.WEB_URL,
    ROOT_PATH: process.cwd() + '',
    DATABASE: {
        CONNECT: process.env.DATABASE_CONNECT as any,
        HOST: process.env.DATABASE_HOST,
        PORT: Number(process.env.DATABASE_PORT),
        USER: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASSWORD,
        NAME: process.env.DATABASE_NAME
    }
};
