const mysql = require('mysql2/promise');
const env = require('./env');

console.log('DB Config:', {
    host: env.DB.HOST,
    user: env.DB.USER,
    database: env.DB.NAME,
    port: env.DB.PORT
});

const pool = mysql.createPool({
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    port: parseInt(env.DB.PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        return false;
    }
};

module.exports = { pool, testConnection };