const mysql = require('mysql2/promise');
const env = require('./env');

// Create connection pool
const pool = mysql.createPool({
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    port: env.DB.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };