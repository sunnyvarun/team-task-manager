const dotenv = require('dotenv');
dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'root',
        PASSWORD: process.env.DB_PASSWORD || '',
        NAME: process.env.DB_NAME || 'team_task_manager',
        PORT: process.env.DB_PORT || 3306
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
        EXPIRE: process.env.JWT_EXPIRE || '30d'
    },
    CORS: {
        ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
    },
    RATE_LIMIT: {
        WINDOW: process.env.RATE_LIMIT_WINDOW || 15,
        MAX: process.env.RATE_LIMIT_MAX || 100
    }
};

module.exports = env;