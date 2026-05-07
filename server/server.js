const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const env = require('./src/config/env');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        // Start listening
        const server = app.listen(env.PORT, () => {
            console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
            console.log(`📍 API available at http://localhost:${env.PORT}/api`);
            console.log(`❤️  Health check at http://localhost:${env.PORT}/health`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle SIGTERM signal
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('💥 Process terminated!');
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();