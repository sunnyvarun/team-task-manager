const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const env = require('./src/config/env');

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!', err.name, err.message);
});

const startServer = async () => {
    const server = app.listen(env.PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${env.PORT}`);
        console.log(`📍 Health: http://0.0.0.0:${env.PORT}/health`);
    });

    try {
        await testConnection();
    } catch (err) {
        console.error('DB connection error:', err.message);
    }

    process.on('SIGTERM', () => {
        console.log('Shutting down...');
        server.close();
    });
};

startServer();