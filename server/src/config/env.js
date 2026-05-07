const dotenv = require('dotenv');
const path = require('path');

// Load .env file if it exists (for local development)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB: {
        HOST: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        USER: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        PASSWORD: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
        NAME: process.env.DB_NAME || process.env.MYSQLDATABASE || 'team_task_manager',
        PORT: process.env.DB_PORT || process.env.MYSQLPORT || 3306
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
        EXPIRE: process.env.JWT_EXPIRE || '30d'
    },
    CORS: {
        ORIGIN: process.env.CORS_ORIGIN || '*'
    },
    RATE_LIMIT: {
        WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
        MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100
    }
};

module.exports = env;