const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const env = require('./src/config/env');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!', err.name, err.message);
    // DON'T exit - let Railway handle it
});

// Start server
const startServer = async () => {
    // Test database connection but DON'T crash if it fails
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.log('⚠️  Database not connected. Will retry...');
    }
    
    // Start the server regardless of database status
    const server = app.listen(env.PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${env.PORT}`);
        console.log(`📍 Health check available at /health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error('UNHANDLED REJECTION!', err.name, err.message);
        // Don't crash
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully');
        server.close(() => {
            console.log('Process terminated');
        });
    });

    // Retry database connection in background
    if (!dbConnected) {
        setTimeout(async () => {
            console.log('🔄 Retrying database connection...');
            await testConnection();
        }, 5000);
    }
};

startServer();